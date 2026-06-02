import { useState, useEffect, useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import NavDropdown from '../components/NavDropdown';

// ── LIVE FAMILY COUNTER -- grows ~200/day from a fixed baseline ──
// ── LIVE FAMILY COUNT ──
const BASELINE_DATE = new Date('2026-04-16T00:00:00Z').getTime();
const BASELINE_COUNT = 35000;
const GROWTH_PER_MS = 500 / (24 * 60 * 60 * 1000);

function getLiveCount() {
  return Math.floor(BASELINE_COUNT + Math.max(0, Date.now() - BASELINE_DATE) * GROWTH_PER_MS);
}

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
    <div ref={ref} className="rv-scale" style={{ textAlign: 'center', marginBottom: 56 }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(48px, 7vw, 84px)',
        fontWeight: 400,
        color: 'var(--green-900)',
        lineHeight: 1,
        letterSpacing: '-1.5px',
        fontVariantNumeric: 'lining-nums tabular-nums',
        fontFeatureSettings: '"lnum" 1, "tnum" 1',
        transform: bumped ? 'scale(1.015)' : 'scale(1)',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}>
        {count.toLocaleString()}+
      </div>
      <div style={{ fontSize: 'var(--text-h3)', color: 'inherit', opacity: 0.5, marginTop: 8, marginBottom: 12 }}>
        families connected to care
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span className="dot-pulse" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--lime)', display: 'inline-block', boxShadow: '0 0 0 4px rgba(212, 242, 92, 0.25)' }} />
        <span style={{ fontSize: 'var(--text-xs)', color: 'inherit', opacity: 0.6, fontWeight: 600 }}>Live</span>
      </div>
    </div>
  );
}

// ── SCROLL PROGRESS BAR ──
function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let rafId = 0;
    function update() {
      if (!ref.current) return;
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? scrolled / max : 0;
      ref.current.style.transform = `scaleX(${pct})`;
    }
    function onScroll() { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(update); }
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('scroll', onScroll); };
  }, []);
  return <div ref={ref} className="scroll-progress" style={{ width: '100%' }} />;
}




// ── SPLIT WORDS -- wraps words in staggered spans ──



/* ============================================================
   CARELU -- ORIGINAL VERSION
   ============================================================
   Feature-based copy with the full design system:
   glassmorphism cards, gradient mesh hero, sticky product tour,
   customer logos, marquee, animated counters, typing indicator.
   ============================================================ */

const W: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '0 36px' };

function Pill({ children, dark }: { children: string; dark?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: 'var(--font-body)',
      fontSize: 11, fontWeight: 600,
      color: dark ? 'rgba(255,255,255,0.7)' : 'var(--gray-500)',
      backgroundColor: dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.04)',
      padding: '7px 16px 7px 12px', borderRadius: 100,
      marginBottom: 24,
      letterSpacing: '0.12em', textTransform: 'uppercase' as const,
      border: dark ? '1px solid rgba(255,255,255,0.18)' : 'none',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--lime)', display: 'inline-block', flexShrink: 0 }} />
      {children}
    </span>
  );
}

function Counter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const ran = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        const dur = 2000, t0 = performance.now();
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

// ── NAV ──────────────────────────────────────────
function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav style={{ position: 'fixed', top: 20, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'center', padding: '0 16px', pointerEvents: 'none' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 999,
          padding: '8px 8px 8px 20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.5)',
          pointerEvents: 'auto',
          maxWidth: '100%',
        }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginRight: 12 }}>
            <img src="/logo.png" alt="Carelu" style={{ height: 36, width: 'auto', display: 'block' }} />
          </a>
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Desktop links */}
            {['Platform', 'How It Works', 'FAQ'].map((t) => (
              <a key={t} href={`#${t.toLowerCase().replace(/\s+/g, '-')}`} className="hide-mobile nav-link" style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--green-900)', textDecoration: 'none', padding: '8px 16px', borderRadius: 999, transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >{t}</a>
            ))}
            <span className="hide-mobile"><NavDropdown /></span>

            {/* CTA -- always visible */}
            <a href="/demo" className="btn-primary" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--green-900)', backgroundColor: '#fff', padding: '10px 22px', borderRadius: 999, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginLeft: 8, transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0f0f0'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}
            >
              Request a Demo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>

            {/* Mobile hamburger */}
            <button className="show-mobile-only" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{
              display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginLeft: 4,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green-900)" strokeWidth="2" strokeLinecap="round">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>
                }
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 96, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
          padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 0,
        }} onClick={() => setMobileOpen(false)}>
          {['Platform', 'How It Works', 'FAQ'].map(t => (
            <a key={t} href={`#${t.toLowerCase().replace(/\s+/g, '-')}`} style={{
              fontSize: 20, fontWeight: 500, color: 'var(--green-900)',
              textDecoration: 'none', padding: '20px 0',
              borderBottom: '1px solid var(--gray-200)',
            }}>{t}</a>
          ))}
          <div style={{ padding: '20px 0', borderBottom: '1px solid var(--gray-200)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-400)', marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Who We Serve</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['ABA Therapy', 'Home Care', 'Addiction Treatment', 'Mental Health', 'Hospice'].map(s => (
                <a key={s} href={`/for/${s.toLowerCase().replace(/\s+/g, '-')}`} style={{
                  fontSize: 17, color: 'var(--gray-600)', textDecoration: 'none',
                }}>{s}</a>
              ))}
            </div>
          </div>
          <a href="/demo" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: 18, fontWeight: 600, color: '#fff',
            backgroundColor: 'var(--green-900)', padding: '20px 24px',
            borderRadius: 16, textDecoration: 'none', marginTop: 24,
          }}>
            Request a Demo
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      )}
    </>
  );
}

// ── HERO ────────────────────────────────────────
function Hero() {
  const headline: Array<{ text: string }> = [
    { text: 'The' },
    { text: 'future' },
    { text: 'of' },
    { text: 'intake' },
    { text: 'is' },
    { text: 'here.' },
  ];

  return (
    <section className="hero-mobile" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      paddingTop: 132, paddingBottom: 80, position: 'relative', overflow: 'hidden',
    }}>
      {/* Natural cloudy sky — gentle, not too bright */}
      <div className="hero-sky" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'url(/sky.jpg)',
        backgroundSize: '200% auto',
        backgroundPosition: '0% 30%',
        animation: 'skyDrift 60s linear infinite',
        opacity: 1,
        filter: 'brightness(0.92) saturate(0.9)',
      }} />

      {/* Mild darkening at the top so white text reads cleanly,
          fading to clean white at the bottom for the page transition. */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.08) 35%, rgba(0,0,0,0) 60%, var(--white) 98%)',
      }} />

      {/* Decorative bottom curve */}
      <svg style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', height: 60, zIndex: 2 }} preserveAspectRatio="none" viewBox="0 0 1440 60">
        <path d="M0 60 C480 0 960 0 1440 60 L1440 60 L0 60Z" fill="var(--white)" />
      </svg>

      <div style={{ ...W, position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '65vh' }}>
        {/* Pill — glassy translucent on the sky */}
        <span className="hero-line" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          fontSize: 11, fontWeight: 600,
          color: '#fff',
          background: 'rgba(255,255,255,0.14)',
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 100, padding: '7px 16px',
          marginBottom: 32, letterSpacing: '0.14em', textTransform: 'uppercase' as const,
          boxShadow: '0 4px 18px rgba(0,0,0,0.10)',
        }}>
          The World&apos;s First Care Enablement Platform
        </span>

        {/* Word-by-word headline — crisp white with a subtle drop shadow for legibility */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(40px, 5.5vw, 78px)',
          fontWeight: 400, lineHeight: 1.05, letterSpacing: '-2px',
          color: '#fff', marginBottom: 22, perspective: 800,
          textShadow: '0 2px 16px rgba(0,0,0,0.35)',
        }}>
          {headline.map((w, i) => (
            <span
              key={i}
              className="hero-word"
              style={{
                animationDelay: `${0.4 + i * 0.13}s`,
                marginRight: i < headline.length - 1 ? '0.28em' : 0,
              }}
            >
              {w.text}
            </span>
          ))}
        </h1>

        {/* Subtle accent line under the headline */}
        <div style={{
          width: 56, height: 1.5, background: 'rgba(255,255,255,0.6)',
          borderRadius: 2, marginBottom: 28,
        }} />

        <p className="hero-sub" style={{
          fontSize: 'clamp(16px, 1.7vw, 19px)',
          color: 'rgba(255,255,255,0.92)',
          lineHeight: 1.65, maxWidth: 580, marginBottom: 44,
          textShadow: '0 1px 8px rgba(0,0,0,0.28)',
        }}>
          Carelu runs your entire intake operation — from first contact to admitted patient. Built for ABA therapy and behavioral health.
        </p>

        <div className="hero-ctas" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Primary solid white CTA */}
          <a href="/demo" className="hero-cta hero-cta-btn" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 14, fontWeight: 600, color: 'var(--green-900)',
            backgroundColor: '#fff',
            padding: '14px 28px', borderRadius: 100, textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 6px 22px rgba(0,0,0,0.12)',
            transition: 'transform 0.2s, box-shadow 0.3s, background-color 0.2s',
            letterSpacing: '0.02em',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.18)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(0,0,0,0.12)'; }}
          >
            Get a Demo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>

          {/* Ghost secondary CTA — white text on translucent */}
          <a href="#how-it-works" className="hero-cta" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 14, fontWeight: 500,
            color: '#fff',
            background: 'transparent',
            padding: '14px 22px', borderRadius: 100, textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.4)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            transition: 'background-color 0.3s, transform 0.2s',
            letterSpacing: '0.02em',
            textShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            See How It Works
          </a>
        </div>

        {/* Trusted-by line — small, soft white below the CTAs */}
        <div style={{
          marginTop: 56,
          fontSize: 11, fontWeight: 600,
          color: 'rgba(255,255,255,0.78)',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          textShadow: '0 1px 6px rgba(0,0,0,0.2)',
        }}>
          Trusted by 100+ of the fastest growing ABA providers
        </div>
      </div>
    </section>
  );
}

// ── MARQUEE ──────────────────────────────────────
function Marquee() {
  const items = ['AI-Powered Intake', 'HIPAA Compliant', 'Insurance Verification', 'ABA Therapy', 'Behavioral Health', '24/7 Availability', 'Document Collection', 'Zero Drop-Off', 'Home Care', 'Addiction Treatment'];
  return (
    <div style={{ padding: '28px 0', overflow: 'hidden', userSelect: 'none' }}>
      <div className="marquee-track">
        {[0, 1, 2, 3].map((copyIdx) => (
          <span key={copyIdx} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 500, letterSpacing: '0.5px', whiteSpace: 'nowrap', color: 'var(--stone)' }}>
            {items.map((item, i) => (
              <span key={i}>{item}<span style={{ margin: '0 24px', opacity: 0.25 }}>/</span></span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── LOGO BAR -- cycling logos ────────────────────
const allLogos = [
  { src: '/logos/strive-aba.png', alt: 'Strive ABA Therapy' },
  { src: '/logos/golden-care.png', alt: 'Golden Care Therapy' },
  { src: '/logos/grateful-care.avif', alt: 'Grateful Care ABA' },
  { src: '/logos/supportive-care.png', alt: 'Supportive Care ABA' },
  { src: '/logos/cross-river.png', alt: 'Cross River Therapy' },
  { src: '/logos/totalcare.webp', alt: 'Total Care Therapy' },
  { src: '/logos/above-beyond.webp', alt: 'Above and Beyond Therapy' },
  { src: '/logos/blossom-aba.webp', alt: 'Blossom ABA Therapy' },
  { src: '/logos/logo-p500.png', alt: 'ABA Provider' },
  { src: '/logos/mastermind.avif', alt: 'Mastermind' },
  { src: '/logos/link-margin.svg', alt: 'Link ABA' },
  { src: '/logos/cropped-logo.png', alt: 'ABA Therapy Provider' },
];

function LogoBar() {
  return (
    <div style={{ padding: '72px 0 80px' }}>
      <p className="rv" style={{
        fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
        letterSpacing: '0.1em', textTransform: 'uppercase' as const,
        color: 'var(--stone)', textAlign: 'center', marginBottom: 48,
      }}>
        Trusted by ABA therapy providers nationwide
      </p>
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        {/* Fade masks on edges */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to right, var(--white), transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to left, var(--white), transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div className="marquee-track" style={{ animation: 'marqueeScroll 45s linear infinite' }}>
          {[0, 1].map((set) => (
            <div key={set} style={{ display: 'flex', alignItems: 'center', gap: 72, paddingRight: 72 }}>
              {allLogos.map((logo) => (
                <div
                  key={`${set}-${logo.alt}`}
                  style={{
                    width: 130, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    style={{
                      maxHeight: '100%', maxWidth: '100%',
                      objectFit: 'contain',
                      filter: 'grayscale(100%) brightness(0.7) contrast(0.9)',
                      opacity: 0.65,
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PROBLEM -- sticky scroll, yarn ball untangles to straight line ──
function Problem() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackH = rect.height - window.innerHeight;
      if (trackH <= 0) return;
      const raw = -rect.top / trackH;
      // Scale t so the chaos animation (which uses thresholds up to 0.62) fills the full
      // section scroll. No dead t-range after close → no visible white tail.
      setT(Math.max(0, Math.min(0.62, raw * 0.62)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Browser tabs representing chaos — overwhelming amount
  const tabs = [
    'Monday.com', 'DocuSign', 'IntakeQ', 'Gmail', 'Google Voice',
    'eFax', 'Outlook', 'Scheduling', 'Insurance...', 'Sheets',
    'Slack', 'RingCentral', 'Jotform', 'HiMama', 'CentralReach',
    'Calendly', 'Zoho CRM', 'Fax Queue', 'Voicemail', 'Forms',
    'Typeform', 'WhatsApp', 'Teams', 'Notion', 'Airtable',
  ];
  // Phase 1: t=0→0.08 — just text (very brief)
  // Phase 2: t=0.08→0.2 — browser + desktop chaos slides up covering text
  // Phase 3: t=0.2→0.55 — chaos shown, cursor moves to X
  // Phase 4: t=0.55 — click, close, green + solution

  // Browser enters from bottom-right, slides up to center
  const browserVisible = t > 0.05;
  const enterProgress = t < 0.06 ? 0 : Math.min(1, (t - 0.06) / 0.08);
  const enterEase = 1 - Math.pow(1 - enterProgress, 3);
  const browserX = (1 - enterEase) * 50; // slides from right
  const browserY = (1 - enterEase) * 60; // slides from bottom

  // Cursor: appears at t=0.3, reaches X at t=0.5
  const cursorProgress = t < 0.3 ? 0 : Math.min(1, (t - 0.3) / 0.2);
  const ce = cursorProgress < 0.5 ? 2 * cursorProgress * cursorProgress : 1 - Math.pow(-2 * cursorProgress + 2, 2) / 2;
  const cursorX = 55 - ce * 52.5;
  const cursorY = 65 - ce * 62.5;

  // Close at t=0.55
  const closed = t >= 0.62;
  const closing = t > 0.55 && !closed;
  const closeScale = closing ? Math.max(0, 1 - (t - 0.55) * 14) : 1;

  // Background scattered windows — extra chaos around the main browser

  return (
    <div ref={trackRef} style={{ height: '260vh', position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}>

        {/* Text -- centered above browser */}
        <div style={{
          textAlign: 'center', position: 'relative', zIndex: 2,
          padding: '0 36px', marginBottom: 32, width: '100%',
        }}>
          {/* Problem text — always visible behind browser, fades when green bg appears */}
          <div style={{ opacity: t > 0.55 ? 0 : 1, transition: 'opacity 0.3s', position: 'absolute', inset: 0 }}>
              <span style={{
                display: 'inline-block', fontSize: 11, fontWeight: 600,
                textTransform: 'uppercase' as const, letterSpacing: '0.1em',
                color: '#999', marginBottom: 20,
              }}>
                What's actually happening
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)',
                fontWeight: 400, lineHeight: 1.12, color: '#000', maxWidth: 640, margin: '0 auto 16px',
              }}>
                You're juggling multiple systems for inquiries, forms, insurance, and scheduling.
              </h2>
              <p style={{ fontSize: 17, color: '#666', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
                Creating a messy intake process that loses families before they ever get to care.
              </p>
            </div>
          {/* Spacer for layout height — must match the bigger hero-style solution h2 */}
          <div style={{ visibility: 'hidden' }}>
            <span style={{ display: 'inline-block', fontSize: 12, marginBottom: 28, padding: '8px 22px' }}>&nbsp;</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 400, lineHeight: 1.06, letterSpacing: '-1.6px', maxWidth: 720, margin: '0 auto 20px' }}>&nbsp;<br />&nbsp;</h2>
            <p style={{ fontSize: 'clamp(15px, 1.55vw, 18px)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>&nbsp;</p>
          </div>
        </div>

        {/* Desktop chaos -- slides up, covers text, then closes */}
        {browserVisible && !closed && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `translate(${browserX}%, ${browserY}%) scale(${closeScale})`,
          opacity: closeScale,
          transformOrigin: 'top left',
          transition: closing ? 'transform 0.15s, opacity 0.15s' : 'transform 0.2s ease-out',
          padding: '3vh 2%',
        }}>
        {/* Main browser -- centered */}
        <div style={{ width: '100%', maxWidth: 720, position: 'relative', zIndex: 5, margin: '0 auto' }}>
          <div style={{
            background: '#f0f0f0', borderRadius: 12, overflow: 'hidden',
            boxShadow: '0 16px 80px rgba(0,0,0,0.18)', border: '1px solid #ccc',
          }}>
            {/* Title bar -- placeholder spacing; visible overlay rendered below at high zIndex */}
            <div style={{ height: 34, background: '#e4e4e4' }} />
            {/* Tab bar -- overflowing */}
            <div style={{ display: 'flex', background: '#d8d8d8', overflow: 'hidden', height: 34 }}>
              {tabs.map((tab, i) => (
                <div key={i} style={{
                  flex: '0 0 auto', padding: '7px 12px', fontSize: 10, fontWeight: 500,
                  color: '#555', background: i === 0 ? '#f5f5f5' : '#e0e0e0',
                  borderRight: '1px solid #c8c8c8', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  {tab}
                  <span style={{ fontSize: 8, color: '#aaa' }}>x</span>
                </div>
              ))}
            </div>
            {/* Content -- more windows, more square */}
            <div style={{ position: 'relative', height: 340, background: '#f5f5f5', overflow: 'hidden' }}>
              {/* DocuSign -- signature UI */}
              <div style={{ position: 'absolute', left: 5, top: 5, width: 220, height: 195, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#333' }}>DocuSign</div>
                <div style={{ padding: 10 }}>
                  <div style={{ height: 6, background: '#eee', borderRadius: 3, width: '80%', marginBottom: 8 }} />
                  <div style={{ height: 6, background: '#eee', borderRadius: 3, width: '60%', marginBottom: 12 }} />
                  <div style={{ border: '1.5px dashed #ccc', borderRadius: 4, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#bbb', marginBottom: 10 }}>Sign here</div>
                  <div style={{ background: '#4898D1', borderRadius: 4, padding: '5px 0', textAlign: 'center', fontSize: 9, color: '#fff', fontWeight: 600 }}>SIGN</div>
                </div>
              </div>

              {/* Gmail -- email list */}
              <div style={{ position: 'absolute', left: 190, top: 15, width: 240, height: 205, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#c5221f' }}>Gmail - 47 unread</div>
                <div style={{ padding: 0 }}>
                  {['Re: Insurance card needed', 'Fwd: Missing diagnosis report', 'URGENT: Parent callback', 'Intake form - Jake M.'].map((e, j) => (
                    <div key={j} style={{ padding: '7px 10px', borderBottom: '1px solid #f5f5f5', fontSize: 9, color: j < 2 ? '#000' : '#666', fontWeight: j < 2 ? 600 : 400, display: 'flex', gap: 6 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: j < 2 ? '#c5221f' : 'transparent', flexShrink: 0, marginTop: 2 }} />
                      {e}
                    </div>
                  ))}
                </div>
              </div>

              {/* Monday.com -- kanban board */}
              <div style={{ position: 'absolute', left: 380, top: 8, width: 230, height: 200, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#ff3d57' }}>Monday.com</div>
                <div style={{ display: 'flex', gap: 4, padding: 6 }}>
                  {[{ label: 'New', n: 12, c: '#579bfc' }, { label: 'Stuck', n: 14, c: '#e2445c' }, { label: 'Done', n: 3, c: '#00c875' }].map((col, j) => (
                    <div key={j} style={{ flex: 1 }}>
                      <div style={{ fontSize: 8, fontWeight: 600, color: col.c, marginBottom: 4 }}>{col.label} ({col.n})</div>
                      {[0, 1, 2].map(k => (
                        <div key={k} style={{ height: 14, background: '#f5f5f5', borderRadius: 3, marginBottom: 3, borderLeft: `3px solid ${col.c}` }} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* IntakeQ -- form */}
              <div style={{ position: 'absolute', left: 70, top: 90, width: 200, height: 185, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#2d9cdb' }}>IntakeQ</div>
                <div style={{ padding: 8 }}>
                  {['Patient Name', 'Date of Birth', 'Insurance ID', 'Diagnosis'].map((f, j) => (
                    <div key={j} style={{ marginBottom: 6 }}>
                      <div style={{ fontSize: 7, color: '#999', marginBottom: 2 }}>{f}</div>
                      <div style={{ height: 14, background: j === 3 ? '#fff3f3' : '#f8f8f8', borderRadius: 3, border: `1px solid ${j === 3 ? '#e88' : '#eee'}` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* eFax */}
              <div style={{ position: 'absolute', left: 310, top: 110, width: 195, height: 175, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#666' }}>eFax - 3 incoming</div>
                <div style={{ padding: 8 }}>
                  {['Dr. Patel - 6 pages', 'Pediatrics referral', 'Insurance auth'].map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: 9, color: '#555' }}>
                      <div style={{ width: 16, height: 20, background: '#f0f0f0', borderRadius: 2, border: '1px solid #ddd', flexShrink: 0 }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Sheets -- spreadsheet */}
              <div style={{ position: 'absolute', left: 25, top: 160, width: 210, height: 170, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#0f9d58' }}>Google Sheets</div>
                <div style={{ padding: 4 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
                    {['Name', 'Status', 'Ins.', 'Jake M.', 'Pending', '---', 'Sarah T.', 'Missing', '---', 'Ryan K.', 'Called', 'Yes'].map((cell, j) => (
                      <div key={j} style={{ fontSize: 7, padding: '3px 4px', background: j < 3 ? '#f0f0f0' : '#fff', border: '1px solid #eee', color: cell === '---' ? '#ddd' : cell === 'Missing' ? '#c00' : '#555', fontWeight: j < 3 ? 600 : 400 }}>{cell}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calendly */}
              <div style={{ position: 'absolute', left: 510, top: 40, width: 195, height: 185, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#006BFF' }}>Calendly</div>
                <div style={{ padding: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
                    {Array.from({ length: 21 }, (_, j) => (
                      <div key={j} style={{ height: 12, borderRadius: 2, background: j === 8 || j === 15 ? '#006BFF' : '#f5f5f5', fontSize: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: j === 8 || j === 15 ? '#fff' : '#bbb' }}>{j + 1}</div>
                    ))}
                  </div>
                  <div style={{ fontSize: 8, color: '#999' }}>Next slot: 2 weeks out</div>
                  <div style={{ fontSize: 8, color: '#c00', marginTop: 3 }}>Waitlist: 9 families</div>
                </div>
              </div>

              {/* RingCentral */}
              <div style={{ position: 'absolute', left: 460, top: 150, width: 210, height: 170, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#f80' }}>RingCentral</div>
                <div style={{ padding: 8 }}>
                  {[{ label: 'Missed calls', val: '7', c: '#c00' }, { label: 'Voicemails', val: '4 new', c: '#f80' }, { label: 'Avg hold', val: '8 min', c: '#999' }].map((s, j) => (
                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: 9 }}>
                      <span style={{ color: '#666' }}>{s.label}</span>
                      <span style={{ color: s.c, fontWeight: 600 }}>{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scattered app windows — all uniform size, each with real, lived-in content */}
          {[
            { name: 'Slack — #intake-team', left: '-15%', top: '8%', content: (
              <div style={{ padding: 8 }}>
                {[
                  { u: 'sarah', m: 'did anyone call Thompson back??', t: '2:14' },
                  { u: 'mike', m: 'i thought rachel had it', t: '2:16' },
                  { u: 'rachel', m: 'which one — i have 6 pending', t: '2:18' },
                ].map((msg, j) => (
                  <div key={j} style={{ marginBottom: 7 }}>
                    <div style={{ fontSize: 8, color: '#999' }}><span style={{ fontWeight: 700, color: '#333' }}>@{msg.u}</span> · {msg.t}</div>
                    <div style={{ fontSize: 9, color: '#444', marginTop: 1 }}>{msg.m}</div>
                  </div>
                ))}
              </div>
            )},
            { name: 'WhatsApp Web', left: '70%', top: '-10%', content: (
              <div style={{ padding: '6px 8px' }}>
                <div style={{ fontSize: 8, color: '#555', marginBottom: 5, display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 600 }}>Mom (Jake T.)</span><span style={{ color: '#25d366' }}>online</span></div>
                {['is my son on the waitlist?', 'hello??', 'i called twice yesterday', 'should i try another clinic?'].map((m, j) => (
                  <div key={j} style={{ background: '#dcf8c6', borderRadius: 6, padding: '3px 7px', fontSize: 9, color: '#333', marginBottom: 3, maxWidth: '88%', marginLeft: 'auto' }}>{m}</div>
                ))}
              </div>
            )},
            { name: 'Microsoft Teams', left: '85%', top: '40%', content: (
              <div style={{ padding: 8 }}>
                <div style={{ fontSize: 8, color: '#999', marginBottom: 6 }}>Intake Standup · 3 people</div>
                {[
                  { l: '23 families in pipeline', red: false },
                  { l: '7 missing insurance cards', red: false },
                  { l: '4 awaiting diagnosis', red: true },
                  { l: '11 no follow-up 5+ days', red: true },
                ].map((row, j) => (
                  <div key={j} style={{ fontSize: 9, color: row.red ? '#c00' : '#555', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 4, height: 4, background: row.red ? '#c00' : '#aaa', borderRadius: 999, flexShrink: 0 }} />
                    {row.l}
                  </div>
                ))}
              </div>
            )},
            { name: 'Outlook — Calendar', left: '-15%', top: '60%', content: (
              <div style={{ padding: '6px 8px' }}>
                <div style={{ fontSize: 8, color: '#999', marginBottom: 5 }}>Today · Tue Mar 12</div>
                {[
                  { t: '9:00', l: 'Parent callback (overdue)', c: '#c00' },
                  { t: '10:30', l: 'Insurance follow-up x3', c: '#4A7C3F' },
                  { t: '1:00', l: 'DocuSign reminders', c: '#4A7C3F' },
                  { t: '2:30', l: 'Fax Dr. Patel AGAIN', c: '#f80' },
                ].map((e, j) => (
                  <div key={j} style={{ fontSize: 9, padding: '3px 6px', borderLeft: `3px solid ${e.c}`, marginBottom: 3, color: '#444', display: 'flex', gap: 6 }}>
                    <span style={{ color: '#888', fontWeight: 600, minWidth: 24 }}>{e.t}</span>{e.l}
                  </div>
                ))}
              </div>
            )},
            { name: 'Notion — SOPs', left: '48%', top: '70%', content: (
              <div style={{ padding: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#333', marginBottom: 3 }}>Intake Process v4.2</div>
                <div style={{ fontSize: 8, color: '#999', marginBottom: 6 }}>Edited by Sarah · 3 months ago</div>
                <div style={{ fontSize: 8.5, color: '#555', lineHeight: 1.4, marginBottom: 3 }}>1. Receive inquiry — any channel</div>
                <div style={{ fontSize: 8.5, color: '#555', lineHeight: 1.4, marginBottom: 3 }}>2. Log in CRM within 24h</div>
                <div style={{ fontSize: 8.5, color: '#555', lineHeight: 1.4, marginBottom: 3 }}>3. Send forms via DocuSign...</div>
                <div style={{ fontSize: 8, color: '#c00', marginTop: 3, fontStyle: 'italic' as const }}>// nobody follows this anymore</div>
              </div>
            )},
            { name: 'Google Forms', left: '35%', top: '-10%', content: (
              <div style={{ padding: '6px 8px' }}>
                <div style={{ fontSize: 8, color: '#673AB7', fontWeight: 600, marginBottom: 5 }}>Patient Intake — response #18</div>
                {[
                  { l: 'Child name', v: 'Jake M.', err: false },
                  { l: 'DOB', v: '', err: true },
                  { l: 'Insurance #', v: 'Aetna — pending', err: false },
                  { l: 'Primary concern', v: '', err: true },
                ].map((f, j) => (
                  <div key={j} style={{ marginBottom: 4 }}>
                    <div style={{ fontSize: 7, color: '#666', marginBottom: 1 }}>{f.l}{f.err && <span style={{ color: '#c00' }}> *</span>}</div>
                    <div style={{ height: 12, background: '#fff', borderRadius: 2, border: `1px solid ${f.err ? '#fbb' : '#e0e0e0'}`, padding: '0 4px', fontSize: 7.5, color: '#444', display: 'flex', alignItems: 'center' }}>{f.v}</div>
                  </div>
                ))}
              </div>
            )},
            { name: 'eFax — incoming', left: '62%', top: '-10%', content: (
              <div style={{ padding: 6 }}>
                <div style={{ fontSize: 8, color: '#c00', marginBottom: 5, fontWeight: 600 }}>3 unread · 4 in queue</div>
                {[
                  { from: 'Dr. Patel', sub: '6p · referral', urgent: true },
                  { from: 'Pediatrics Grp', sub: '3p · auth' },
                  { from: 'Aetna', sub: '11p · denial' },
                  { from: 'Unknown', sub: '1p · ??' },
                ].map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 0', borderBottom: '1px solid #f3f3f3' }}>
                    <div style={{ width: 12, height: 14, background: '#f3f3f3', borderRadius: 1, border: `1px solid ${f.urgent ? '#c00' : '#ddd'}`, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 8.5, color: f.urgent ? '#c00' : '#555', fontWeight: f.urgent ? 600 : 400 }}>{f.from}</div>
                      <div style={{ fontSize: 7, color: '#999' }}>{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            )},
            { name: 'Phone Log', left: '65%', top: '70%', content: (
              <div style={{ padding: 6 }}>
                <div style={{ fontSize: 8, color: '#999', marginBottom: 5 }}>Today · 7 missed</div>
                {[
                  { n: 'Unknown · 555-2104', t: '11:55', miss: true },
                  { n: 'Sarah T. (mom)', t: '11:47', miss: true },
                  { n: 'VM · 555-8821', t: '10:14', miss: false },
                  { n: 'Dr. Patel office', t: '9:02', miss: false },
                ].map((c, j) => (
                  <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f3f3f3' }}>
                    <span style={{ fontSize: 8.5, color: c.miss ? '#c00' : '#555', fontWeight: c.miss ? 600 : 400 }}>{c.n}</span>
                    <span style={{ fontSize: 7, color: '#999' }}>{c.t}</span>
                  </div>
                ))}
              </div>
            )},
          ].map((win, i) => (
            <div key={`stack${i}`} style={{
              position: 'absolute', left: win.left, top: win.top, width: 180, height: 150,
              background: '#fff', borderRadius: 8, border: '1px solid #ddd',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              zIndex: 4, overflow: 'hidden',
            }}>
              <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f8f8' }}>
                {win.name}
                <span style={{ color: '#ccc', fontSize: 9 }}>x</span>
              </div>
              {win.content}
            </div>
          ))}

          {/* Mouse cursor -- BIG */}
          {t > 0.25 && (
            <div style={{
              position: 'absolute',
              left: `${cursorX}%`, top: `${cursorY}%`,
              transition: 'left 0.08s ease-out, top 0.08s ease-out',
              zIndex: 10, pointerEvents: 'none',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))',
            }}>
              <svg width="40" height="48" viewBox="0 0 20 24" fill="none">
                <path d="M1 1L1 18L6 13L11 22L14 20L9 12L16 12L1 1Z" fill="#000" stroke="#fff" strokeWidth="1" />
              </svg>
            </div>
          )}

          {/* Title bar overlay -- sits above the shell but BELOW scattered windows, so small windows render on top */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            display: 'flex', alignItems: 'center', padding: '10px 16px',
            background: '#e4e4e4', gap: 10, zIndex: 1,
            borderRadius: '12px 12px 0 0',
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                background: t > 0.48 ? '#ff3b30' : '#ff5f57',
                boxShadow: t > 0.48 ? '0 0 16px rgba(255,59,48,0.7)' : 'none',
                transform: t > 0.48 ? 'scale(1.5)' : 'scale(1)',
                transition: 'all 0.15s',
              }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#28c840' }} />
            </div>
          </div>
        </div>
        </div>
        )}

        {/* Channel ring — removed, now in HowCarelu section */}
        {false && t > 0.82 && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: t > 0.85 ? 1 : (t - 0.82) * 33,
            transition: 'opacity 0.2s',
          }}>
            <div style={{ position: 'relative', width: 320, height: 320 }}>
              {/* Ring line */}
              <svg viewBox="0 0 320 320" style={{ position: 'absolute', inset: 0 }}>
                <circle cx="160" cy="160" r="130" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              </svg>

              {/* Center */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>ALL</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>CHANNELS</div>
              </div>

              {/* Channel nodes */}
              {['Phone', 'Text', 'Chat', 'Forms', 'Fax', 'Email'].map((ch, i, arr) => {
                const angle = (-90 + (i / arr.length) * 360) * (Math.PI / 180);
                const x = 160 + Math.cos(angle) * 130;
                const y = 160 + Math.sin(angle) * 130;
                const threshold = 0.86 + i * 0.015;
                const visible = t > threshold;

                return (
                  <div key={ch} style={{
                    position: 'absolute',
                    left: x - 28, top: y - 28,
                    width: 56, height: 56, borderRadius: '50%',
                    background: visible ? 'rgba(74,124,63,0.9)' : 'rgba(255,255,255,0.06)',
                    border: visible ? '2px solid rgba(138,200,120,0.6)' : '2px solid rgba(255,255,255,0.1)',
                    boxShadow: visible ? '0 0 24px rgba(74,124,63,0.5)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: visible ? 'scale(1)' : 'scale(0.7)',
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: visible ? '#fff' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s' }}>{ch}</span>
                  </div>
                );
              })}

              {/* Connecting lines */}
              <svg viewBox="0 0 320 320" style={{ position: 'absolute', inset: 0 }}>
                {['Phone', 'Text', 'Chat', 'Forms', 'Fax', 'Email'].map((_, i, arr) => {
                  const angle = (-90 + (i / arr.length) * 360) * (Math.PI / 180);
                  const x = 160 + Math.cos(angle) * 130;
                  const y = 160 + Math.sin(angle) * 130;
                  return <line key={i} x1="160" y1="160" x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />;
                })}
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── CUSTOMER STORIES ─────────────────────────────
const customerStories = [
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
  const active = customerStories[activeIdx];
  const prev = () => setActiveIdx((i) => (i - 1 + customerStories.length) % customerStories.length);
  const next = () => setActiveIdx((i) => (i + 1) % customerStories.length);

  // Small corner markers — subtle dark squares like the Intercom layout
  const cornerSq = { width: 6, height: 6, background: 'rgba(0,0,0,0.18)' } as const;

  return (
    <section style={{
      paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)',
      background: '#fff',
      position: 'relative',
    }}>
      <div style={W}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <span className="rv" style={{
            display: 'inline-block', fontSize: 11, fontWeight: 600,
            color: 'var(--gray-500)', background: 'rgba(0,0,0,0.04)',
            borderRadius: 100, padding: '7px 18px',
            marginBottom: 24, letterSpacing: '0.12em', textTransform: 'uppercase' as const,
          }}>
            Customer stories
          </span>
          <h2 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.6vw, 60px)',
            fontWeight: 400, lineHeight: 1.08, letterSpacing: '-1.4px',
            color: 'var(--green-900)', maxWidth: 720, margin: '0 auto',
          }}>
            Hear from teams who trust Carelu.
          </h2>
        </div>

        {/* Testimonial frame — sits on the white section, just keeps the corner markers */}
        <div className="rv-scale d2" style={{
          position: 'relative',
          maxWidth: 1100, margin: '0 auto',
          padding: 'clamp(40px, 5vw, 72px) clamp(32px, 5vw, 64px) clamp(40px, 5vw, 64px)',
        }}>
          {/* 4 corner markers */}
          <div style={{ position: 'absolute', top: 0,  left: 0,  ...cornerSq }} />
          <div style={{ position: 'absolute', top: 0,  right: 0, ...cornerSq }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0,  ...cornerSq }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, ...cornerSq }} />

          <div className="testimonial-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            gap: 64,
            alignItems: 'center',
            minHeight: 380,
          }}>
            {/* Left column: logo + quote + name */}
            <div key={activeIdx} style={{ animation: 'testFade 0.5s var(--ease-dramatic)' }}>
              <img
                src={active.logo}
                alt={active.company}
                style={{
                  height: 34, width: 'auto', objectFit: 'contain',
                  filter: 'grayscale(100%) brightness(0.35) contrast(1)',
                  marginBottom: 72,
                  display: 'block',
                }}
              />
              <blockquote style={{
                fontSize: 'clamp(22px, 2.4vw, 32px)',
                lineHeight: 1.35, letterSpacing: '-0.3px',
                color: 'var(--green-900)',
                fontWeight: 400,
                margin: '0 0 64px',
              }}>
                &ldquo;{active.quote}&rdquo;
              </blockquote>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--green-900)', marginBottom: 4 }}>
                  {active.name}
                </div>
                <div style={{ fontSize: 15, color: 'var(--gray-500)' }}>
                  {active.role}, {active.company}
                </div>
              </div>
            </div>

            {/* Right column: square portrait */}
            <div className="testimonial-photo" style={{
              width: 280, height: 320,
              overflow: 'hidden',
              position: 'relative',
              justifySelf: 'end',
            }}>
              <img
                key={activeIdx}
                src={active.photo}
                alt={active.name}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  objectPosition: 'center top',
                  animation: 'testFade 0.5s var(--ease-dramatic)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Navigation: prev/next arrows + dots */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32,
          marginTop: 56,
        }}>
          <button onClick={prev} aria-label="Previous" style={{
            width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)',
            background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--green-900)', transition: 'background 0.2s, border-color 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; }}
          >
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
            color: 'var(--green-900)', transition: 'background 0.2s, border-color 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 5L12.5 10L7.5 15" /></svg>
          </button>
        </div>

        {/* Proof stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, marginTop: 96, borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: 40 }}>
          {[
            { node: <><Counter target={60} suffix="%" /> → <Counter target={15} suffix="%" /></>, desc: 'Family drop-off rate, first month with Carelu' },
            { node: <><Counter target={0} /> missed</>, desc: 'Every lead followed up — no one falls through the cracks' },
            { node: <><Counter target={24} /> / <Counter target={7} /></>, desc: 'Nights, weekends, holidays — never miss a family' },
          ].map((s, i) => (
            <div key={i} className={`rv d${i + 1}`} style={{ padding: '0 24px', borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.1)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--green-900)', marginBottom: 8, fontVariantNumeric: 'lining-nums tabular-nums' }}>{s.node}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', lineHeight: 1.5 }}>{s.desc}</div>
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
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => { obs.disconnect(); if (interval) clearInterval(interval); };
  }, []);

  const teamAvatars: { initials: string; bg: string }[] = [
    { initials: 'SK', bg: '#C5BFB2' },
    { initials: 'MR', bg: '#DDD8CC' },
    { initials: 'AP', bg: '#EDE9E0' },
  ];

  // Filled progress percent — derived from `filled`
  const fillPct = (Math.max(0, Math.min(filled - 1, milestones.length - 1)) / (milestones.length - 1)) * 100;
  const ready = filled >= milestones.length;

  return (
    <div ref={ref} style={{
      width: '100%', maxWidth: 360, margin: '0 auto',
      background: '#fff', borderRadius: 18,
      padding: '22px 22px 20px',
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 6px 30px rgba(0,0,0,0.05)',
    }}>
      {/* Top status — lime dot + label, transitions to "Case ready" when filled */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18 }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: ready ? 'var(--lime)' : 'rgba(0,0,0,0.18)',
          boxShadow: ready ? '0 0 0 5px rgba(212, 242, 92, 0.25)' : 'none',
          transition: 'background 0.4s, box-shadow 0.4s',
        }} />
        <span style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
          color: ready ? 'var(--green-700)' : 'var(--gray-500)',
          textTransform: 'uppercase',
          transition: 'color 0.4s',
        }}>
          {ready ? 'Case ready · scheduled' : 'In progress…'}
        </span>
      </div>

      {/* Patient identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
        <div style={{
          width: 46, height: 46, borderRadius: '50%',
          background: 'var(--sage-100)', border: '1.5px solid var(--sage-300)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 500,
          color: 'var(--green-900)', flexShrink: 0,
        }}>JM</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--green-900)', marginBottom: 2 }}>
            Jake M., age 4
          </div>
          <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
            Blue Cross PPO · ABA Therapy
          </div>
        </div>
      </div>

      {/* Progress ribbon */}
      <div style={{ position: 'relative', padding: '0 6px', marginBottom: 22 }}>
        {/* Background line */}
        <div style={{
          position: 'absolute', top: 6, left: 13, right: 13,
          height: 2, background: 'rgba(0,0,0,0.08)', borderRadius: 2,
        }} />
        {/* Filled progress line */}
        <div style={{
          position: 'absolute', top: 6, left: 13,
          width: `calc((100% - 26px) * ${fillPct / 100})`,
          height: 2, background: 'var(--green-700)', borderRadius: 2,
          transition: 'width 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
        {/* Milestone dots */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
          {milestones.map((m, i) => {
            const done = filled > i;
            return (
              <div key={m} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 0,
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: done ? 'var(--green-700)' : '#fff',
                  border: done ? '0' : '2px solid rgba(0,0,0,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: done ? 'scale(1)' : 'scale(0.8)',
                  transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease 0.15s',
                  boxShadow: done && i === milestones.length - 1 && ready ? '0 0 0 4px rgba(212, 242, 92, 0.35)' : 'none',
                  flexShrink: 0,
                }}>
                  {done && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: done ? 1 : 0, transition: 'opacity 0.25s ease 0.2s' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span style={{
                  fontSize: 10,
                  color: done ? 'var(--green-900)' : 'var(--gray-500)',
                  fontWeight: done ? 500 : 400,
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.3s ease',
                }}>{m}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Handoff footer — appears once everything's filled */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px', borderRadius: 12,
        background: 'var(--sage-50)',
        opacity: ready ? 1 : 0.5,
        transform: ready ? 'translateY(0)' : 'translateY(4px)',
        transition: 'opacity 0.5s ease 0.1s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M13 6l6 6-6 6" />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--green-900)' }}>
            Handed off to clinical team
          </span>
        </div>
        <div style={{ display: 'flex' }}>
          {teamAvatars.map((a, i) => (
            <div key={a.initials} style={{
              width: 22, height: 22, borderRadius: '50%',
              background: a.bg,
              border: '2px solid var(--sage-50)',
              marginLeft: i > 0 ? -8 : 0,
              fontSize: 9, fontWeight: 600,
              color: 'var(--green-900)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{a.initials}</div>
          ))}
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
    }, { threshold: 0.4 });
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
  const channels = ['Phone', 'Text', 'Chat', 'Forms', 'Fax', 'Email'];
  const [step, setStep] = useState(0); // 0 = hidden, 1 = center, 2..7 = each pill
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    let ran = false;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran) {
        ran = true;
        setStep(1);
        let s = 1;
        interval = setInterval(() => {
          s++;
          setStep(s);
          if (s >= channels.length + 1) {
            if (interval) clearInterval(interval);
          }
        }, 320);
        obs.disconnect();
      }
    }, { threshold: 0.45 });
    obs.observe(el);
    return () => { obs.disconnect(); if (interval) clearInterval(interval); };
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', maxWidth: 360, aspectRatio: '1 / 1', margin: '0 auto' }}>
      <svg viewBox="0 0 360 360" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {channels.map((_, i) => {
          const a = (-90 + i * 60) * (Math.PI / 180);
          const x2 = 180 + Math.cos(a) * 130;
          const y2 = 180 + Math.sin(a) * 130;
          const visible = step >= i + 2;
          return (
            <line key={i}
              x1="180" y1="180" x2={x2} y2={y2}
              stroke="rgba(0,0,0,0.12)" strokeWidth="1"
              strokeDasharray="140"
              strokeDashoffset={visible ? 0 : 140}
              style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
          );
        })}
      </svg>
      {/* Center hub */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(-50%, -50%) scale(${step >= 1 ? 1 : 0.2})`,
        opacity: step >= 1 ? 1 : 0,
        width: 88, height: 88, borderRadius: '50%',
        background: 'var(--green-900)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500,
        letterSpacing: '-0.3px',
        transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
      }}>
        Carelu
      </div>
      {/* Channel pills */}
      {channels.map((ch, i) => {
        const a = (-90 + i * 60) * (Math.PI / 180);
        const x = 50 + Math.cos(a) * 36;
        const y = 50 + Math.sin(a) * 36;
        const visible = step >= i + 2;
        return (
          <div key={ch} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.4})`,
            opacity: visible ? 1 : 0,
            background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 999, padding: '7px 14px 7px 11px',
            fontSize: 12, fontWeight: 500, color: 'var(--green-900)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            whiteSpace: 'nowrap',
            display: 'inline-flex', alignItems: 'center', gap: 7,
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease',
          }}>
            <ChannelIcon name={ch} />
            {ch}
          </div>
        );
      })}
    </div>
  );
}

// ── HOW CARELU WORKS ──
function HowCarelu() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.4 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const cornerSq = { width: 6, height: 6, background: 'rgba(0,0,0,0.18)' } as const;

  const steps = [
    {
      step: '01',
      tag: 'Multi-channel',
      title: 'Every channel. One inbox.',
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
      title: 'Follows up and delivers. Zero handoff.',
      desc: 'Missing documents? Carelu nudges. Doctor hasn\'t responded? It follows up. Once everything is collected and signed, Carelu schedules the assessment and hands off a complete, ready case.',
      visual: <HandoffVisual />,
    },
  ];

  return (
    <>
    {/* See it in action — clean video in a framed Intercom-style card */}
    <section style={{
      paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)',
      background: 'var(--bone)', position: 'relative',
    }}>
      <div style={W}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="rv" style={{
            display: 'inline-block', fontSize: 11, fontWeight: 600,
            color: 'var(--gray-500)', background: 'rgba(0,0,0,0.04)',
            borderRadius: 100, padding: '7px 18px',
            marginBottom: 24, letterSpacing: '0.12em', textTransform: 'uppercase' as const,
          }}>
            See it in action
          </span>
          <h2 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.6vw, 60px)',
            fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.08,
            letterSpacing: '-1.4px', margin: 0,
          }}>
            Watch it work.
          </h2>
        </div>

        {/* Video frame with corner markers */}
        <div style={{
          position: 'relative', maxWidth: 1040, margin: '0 auto',
          padding: '40px 32px',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, ...cornerSq }} />
          <div style={{ position: 'absolute', top: 0, right: 0, ...cornerSq }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, ...cornerSq }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, ...cornerSq }} />

          <div className="rv-scale" style={{
            borderRadius: 20, overflow: 'hidden', background: '#fff',
            boxShadow: '0 12px 48px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <video
              ref={videoRef}
              controls muted loop playsInline
              style={{ width: '100%', height: 'auto', display: 'block' }}
            >
              <source src="https://framerusercontent.com/assets/ZEFznJK3xO8gPZ8psOliFXvKwO0.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>

    {/* How it works — horizontal scroll: cards slide left while page is held in place */}
    <HowItWorksScroll steps={steps} />

    </>
  );
}

// ── HOW IT WORKS — horizontal scroll variant ─────
function HowItWorksScroll({ steps }: { steps: Array<{ step: string; tag: string; title: string; desc: string; visual: React.ReactNode }> }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const rect = section.getBoundingClientRect();
      const trackH = rect.height - window.innerHeight;
      if (trackH <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / trackH));
      const trackWidth = track.scrollWidth;
      const viewportW = window.innerWidth;
      const maxShift = Math.max(0, trackWidth - viewportW);
      track.style.transform = `translate3d(${-progress * maxShift}px, 0, 0)`;

      // Active card indicator
      const total = steps.length;
      const idx = Math.min(total - 1, Math.floor(progress * total));
      setActiveIdx(idx);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [steps.length]);

  return (
    <section ref={sectionRef} style={{
      height: '320vh', position: 'relative', background: 'var(--bone)',
    }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          paddingTop: 'clamp(60px, 8vh, 96px)', paddingBottom: 32,
          textAlign: 'center',
        }}>
          <span className="rv" style={{
            display: 'inline-block', fontSize: 11, fontWeight: 600,
            color: 'var(--gray-500)', background: 'rgba(0,0,0,0.04)',
            borderRadius: 100, padding: '7px 18px',
            marginBottom: 20, letterSpacing: '0.12em', textTransform: 'uppercase' as const,
          }}>
            How it works
          </span>
          <h2 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4.2vw, 54px)',
            fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.08,
            letterSpacing: '-1.3px', margin: 0,
          }}>
            Scale your practice on your terms.
          </h2>
        </div>

        {/* Horizontal track of cards */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
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
              <div key={s.step} style={{
                background: '#fff', borderRadius: 24,
                boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03)',
                display: 'grid', gridTemplateColumns: '1fr 1.2fr',
                overflow: 'hidden',
                width: 'clamp(640px, 78vw, 900px)',
                minHeight: 380,
                flexShrink: 0,
              }}>
                <div style={{
                  padding: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.015)',
                }}>
                  {s.visual}
                </div>
                <div style={{
                  padding: '40px 40px 32px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
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
                      fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.4vw, 30px)',
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
                    marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.06)',
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
            ))}
          </div>
        </div>

        {/* Progress dots */}
        <div style={{
          paddingBottom: 'clamp(40px, 6vh, 64px)',
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

// ── IMPACT — clean stat cards on cream ──────────
function Impact() {
  return (
    <section style={{
      position: 'relative', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)',
      background: 'var(--bone)',
    }}>
      <div style={{ ...W, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="rv"><Pill>Proven results</Pill></div>
          {/* Illustration sits between the pill and the heading */}
          <div className="rv-scale" style={{ margin: '0 0 20px' }}>
            <img
              src="/results-illustration.svg"
              alt=""
              aria-hidden="true"
              style={{ width: 150, height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </div>
          <h2 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.6vw, 60px)',
            fontWeight: 400, color: 'var(--green-900)',
            lineHeight: 1.08, letterSpacing: '-1.4px', margin: 0,
          }}>
            The results speak louder than we can.
          </h2>
        </div>

        <div className="impact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 1100, margin: '0 auto' }}>
          {[
            { v: 3, s: '\u00d7', t2: 'More families admitted', d: 'Same team. Same hours. Triple the output.' },
            { v: 10, s: ' min', t2: 'First contact to intake-ready', p: '<', d: 'What used to take 3-5 days.' },
            { v: 85, s: '%', t2: 'Family completion rate', d: 'Industry average is under 30%.' },
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

        {/* Featured big counter — right under the stat cards */}
        <div style={{
          maxWidth: 1100, margin: '56px auto 0',
          textAlign: 'center',
          color: 'var(--green-900)',
        }}>
          <LiveCounter />
        </div>

      </div>
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

  return (
    <section style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)', background: 'var(--white)' }}>
      <div style={W}>
        {/* The "certificate" */}
        <div className="rv-scale" style={{
          border: '1.5px solid var(--gray-200)',
          borderRadius: 24,
          padding: 'clamp(48px, 6vw, 80px)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Corner flourishes -- subtle document feel */}
          {[{ top: 0, left: 0 }, { top: 0, right: 0, scaleX: -1 }, { bottom: 0, left: 0, scaleY: -1 }, { bottom: 0, right: 0, scaleX: -1, scaleY: -1 }].map((pos, i) => (
            <svg key={i} width="48" height="48" viewBox="0 0 48 48" fill="none" style={{
              position: 'absolute', ...pos,
              transform: `scaleX(${pos.scaleX ?? 1}) scaleY(${pos.scaleY ?? 1})`,
              opacity: 0.15,
            }}>
              <path d="M0 0 L48 0 L48 4 L4 4 L4 48 L0 48 Z" fill="var(--green-800)" />
            </svg>
          ))}

          {/* Shield icon */}
          <div className="rv" style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', margin: '0 auto 20px',
              background: 'var(--sage-100)', border: '1px solid var(--sage-200)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green-700)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h2 className="rv-scale" style={{
              fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400,
              color: 'var(--green-900)', lineHeight: 1.12, marginBottom: 12,
            }}>
              Your compliance team<br />will love us.
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-400)', maxWidth: 400, margin: '0 auto' }}>
              Built for healthcare from day one. Not retrofitted.
            </p>
          </div>

          {/* Certification grid -- formal, structured */}
          <div className="mobile-stack" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0, borderTop: '1px solid var(--gray-200)',
          }}>
            {items.map((item, i) => (
              <div key={item.label} className={`rv d${i + 1}`} style={{
                padding: '28px 24px',
                borderRight: (i % 3 !== 2) ? '1px solid var(--gray-200)' : 'none',
                borderBottom: i < 3 ? '1px solid var(--gray-200)' : 'none',
              }}>
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
              fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 400, color: 'var(--green-900)',
              lineHeight: 1.08, letterSpacing: '-1.2px', marginBottom: 16,
            }}>
              Let&apos;s clear things up.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.6 }}>
              Still have questions? <a href="mailto:hello@carelu.ai" style={{ color: 'var(--green-900)', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}>We&apos;re real humans — just ask.</a>
            </p>

            {/* Hand-drawn doodle: vector SVG version */}
            <svg
              className="rv d2"
              viewBox="270 420 1060 480"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{ width: '100%', maxWidth: 320, display: 'block', marginTop: 40 }}
            >
              <image
                href="/faq-doodle.svg"
                x="0"
                y="0"
                width="1600"
                height="1117"
                preserveAspectRatio="xMidYMid meet"
              />
            </svg>
          </div>
          <div style={{
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
                <div style={{ maxHeight: open === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.5s var(--ease-dramatic)' }}>
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
      padding: 'clamp(80px, 10vw, 140px) 36px 36px',
      backgroundImage: 'url(/footer-landscape.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      overflow: 'hidden',
    }}>
      {/* Subtle dark wash so cream text reads cleanly against the landscape */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(20,30,25,0.1) 0%, rgba(20,30,25,0.22) 50%, rgba(20,30,25,0.38) 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
        {/* Headline */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(60px, 8vw, 100px)' }}>
          <h2 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 46px)',
            fontWeight: 400, color: 'var(--bone)',
            lineHeight: 1.15, letterSpacing: '-1.2px',
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
                    <a href="#" style={{
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--lime)', display: 'inline-block', boxShadow: '0 0 0 3px rgba(212,242,92,0.3)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--bone)', letterSpacing: '-0.6px', textShadow: '0 1px 6px rgba(0,0,0,0.2)' }}>carelu</span>
          </div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'rgba(250,248,243,0.7)', textShadow: '0 1px 4px rgba(0,0,0,0.18)' }}>© 2026 Carelu, Inc.</span>
            <a href="#" style={{ fontSize: 12, color: 'rgba(250,248,243,0.7)', textDecoration: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.18)' }}>Privacy Policy</a>
            <a href="#" style={{ fontSize: 12, color: 'rgba(250,248,243,0.7)', textDecoration: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.18)' }}>Terms</a>
            <a href="#" style={{ fontSize: 12, color: 'rgba(250,248,243,0.7)', textDecoration: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.18)' }}>Security</a>
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

  // ===== STACK GEOMETRY =====
  const RX = 170;
  const RY = 48;
  const PLATE_DEPTH = 34;
  const PLATE_GAP_CLOSED = 0;     // closed → all plates collapsed under the top one
  const PLATE_GAP_OPEN = 64;      // fully open → roomy stack
  const TOP_CY = 56;
  const STROKE = 'rgba(140,140,160,0.55)';
  // =========================

  const PLATE_CX = 580;
  const LEFT_LABEL_X = 250;             // where the connector line starts (longer line now)
  const LABEL_LEFT_ANCHOR_X = 30;       // left edge of label column
  const RIGHT_LABEL_X = PLATE_CX + RX + 60;

  const SVG_W = 760;
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
  const START_THRESHOLD = 0.45;
  const END_THRESHOLD = 0.72;
  const animProgress = Math.max(0, Math.min(1, (progress - START_THRESHOLD) / (END_THRESHOLD - START_THRESHOLD)));

  // ease-out cubic for a soft "settle" feel
  const eased = 1 - Math.pow(1 - animProgress, 3);
  const PLATE_GAP = PLATE_GAP_CLOSED + (PLATE_GAP_OPEN - PLATE_GAP_CLOSED) * eased;

  // Label/connector opacity — top label is always visible; others fade in as their layer emerges
  const labelOpacity = (i: number) => {
    if (i === 0) return 1;
    // each label only starts revealing once animProgress is well underway for its layer
    const step = 1 / PLATE_COUNT;
    const start = i * step * 0.9;
    const end = start + step * 0.9;
    return Math.max(0, Math.min(1, (animProgress - start) / (end - start)));
  };

  return (
    <section style={{
      position: 'relative', background: 'var(--bone)',
    }}>
      <div ref={sectionRef} style={{
        // Scroll tracker — sticky inner lives here. Animation progress is tied to this height.
        height: '360vh', position: 'relative',
      }}>
      <div style={{
        position: 'sticky', top: 0,
        height: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingTop: 80, paddingBottom: 40,
        overflow: 'hidden',
      }}>
      <div style={W}>
        {/* Original section heading restored */}
        <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 48px', padding: '0 24px' }}>
          <div className="rv"><Pill>Introducing Carelu</Pill></div>
          <h2 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(42px, 5.4vw, 68px)',
            fontWeight: 300,
            color: 'var(--green-900)',
            lineHeight: 1.02,
            letterSpacing: '-2.2px',
            margin: '0 0 22px',
          }}>
            One platform. Every channel.<br />
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Always on.</span>
          </h2>
          <p className="rv d2" style={{
            fontSize: 18, color: 'var(--gray-500)',
            lineHeight: 1.55, maxWidth: 540, margin: '0 auto',
          }}>
            AI intake infrastructure that makes sure every family who can receive care does.
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
              <div key={i} style={{
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
      {/* Cream buffer — gives the open stack breathing room before the next section appears */}
      <div style={{ height: '36vh' }} />
    </section>
  );
}

// ── PAGE ─────────────────────────────────────────
export default function Landing() {
  useReveal();
  return (
    <>
      <ScrollProgress />
      <Nav />
      <Hero />
      <LogoBar />
      <Marquee />
      <Problem />
      <MuralReveal />
      <CustomerStories />
      <HowCarelu />
      <Impact />
      <Compliance />
      <Faq />
      <CtaFooter />
    </>
  );
}
