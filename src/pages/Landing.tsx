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

// ── LIVE COUNTER -- ticks up in real time ──
function LiveCounter() {
  const [count, setCount] = useState(getLiveCount);

  useEffect(() => {
    const interval = setInterval(() => setCount(getLiveCount()), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rv-scale" style={{ textAlign: 'center', marginBottom: 56 }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(64px, 10vw, 120px)',
        color: 'inherit',
        lineHeight: 1,
        letterSpacing: '-3px',
      }}>
        {count.toLocaleString()}+
      </div>
      <div style={{ fontSize: 'var(--text-h3)', color: 'inherit', opacity: 0.5, marginTop: 8, marginBottom: 12 }}>
        families connected to care
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span className="dot-pulse" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--sage-300)', display: 'inline-block' }} />
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
      display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
      fontWeight: 600,
      color: dark ? 'var(--sage-300)' : 'var(--green-800)',
      backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'var(--sage-100)',
      padding: '6px 16px', borderRadius: 'var(--radius-pill)', marginBottom: 24,
    }}>{children}</span>
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
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--gray-200)' }}>
        <div style={{ ...W, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 96 }}>
          <a href="/" style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 500, color: 'var(--green-900)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, letterSpacing: '-1.2px', lineHeight: 1 }}>
            <span className="dot-pulse" style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: 'var(--green-700)', display: 'inline-block', marginTop: 7 }} />
            carelu
          </a>
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {/* Desktop links */}
            {['Platform', 'How It Works', 'FAQ'].map((t) => (
              <a key={t} href={`#${t.toLowerCase().replace(/\s+/g, '-')}`} className="hide-mobile nav-link" style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--gray-500)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--green-900)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray-500)'; }}
              >{t}</a>
            ))}
            <span className="hide-mobile"><NavDropdown /></span>

            {/* CTA -- always visible */}
            <a href="/demo" className="btn-primary" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#fff', backgroundColor: 'var(--green-800)', padding: '10px 24px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--green-700)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--green-800)'; }}
            >
              Request a Demo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>

            {/* Mobile hamburger */}
            <button className="show-mobile-only" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{
              display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green-900)" strokeWidth="2" strokeLinecap="round">
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

  return (
    <section className="hero-mobile" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      paddingTop: 132, paddingBottom: 80, position: 'relative', overflow: 'hidden',
    }}>
      {/* Living sky background */}
      <div className="hero-sky" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'url(/sky.jpg)',
        backgroundSize: '200% auto',
        backgroundPosition: '0% 30%',
        animation: 'skyDrift 50s linear infinite',
        opacity: 1,
      }} />
      {/* Slight darken for text contrast + fade to white at bottom */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.15) 70%, var(--white) 95%)',
      }} />

      {/* Decorative bottom curve */}
      <svg style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', height: 60, zIndex: 2 }} preserveAspectRatio="none" viewBox="0 0 1440 60">
        <path d="M0 60 C480 0 960 0 1440 60 L1440 60 L0 60Z" fill="var(--white)" />
      </svg>

      <div style={{ ...W, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '65vh' }}>
        {/* Pill */}
        <span className="rv hero-line" style={{
          display: 'inline-block', fontSize: 12, fontWeight: 600,
          color: '#4a6a7a', background: 'rgba(220,240,250,0.85)',
          borderRadius: 100, padding: '8px 22px',
          border: 'none',
          marginBottom: 28, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
        }}>
          The World's First Care Enablement Platform
        </span>

        <h1 className="rv-scale" style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 6.5vw, 88px)',
          fontWeight: 400, lineHeight: 1.08, letterSpacing: '-2px',
          color: '#fff', marginBottom: 20,
          textShadow: '0 2px 24px rgba(0,0,0,0.25)',
        }}>
          The future of intake is here.
        </h1>

        <p className="rv d1" style={{
          fontSize: 'clamp(15px, 1.6vw, 18px)', color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.7, maxWidth: 460, marginBottom: 36,
        }}>
          Carelu runs your entire intake operation -- from first contact to admitted patient. Built for ABA therapy and behavioral health.
        </p>

        <a href="/demo" className="hero-cta-btn" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontSize: 14, fontWeight: 600, color: '#fff',
          backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)',
          padding: '14px 32px', borderRadius: 100, textDecoration: 'none',
          border: '1px solid rgba(255,255,255,0.25)',
          transition: 'background-color 0.3s, transform 0.2s',
          letterSpacing: '0.02em',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          Request a Demo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
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
            <div key={set} style={{ display: 'flex', alignItems: 'center', gap: 100, paddingRight: 100 }}>
              {allLogos.map((logo) => (
                <img
                  key={`${set}-${logo.alt}`}
                  src={logo.src}
                  alt={logo.alt}
                  style={{ height: 72, width: 'auto', objectFit: 'contain', opacity: 0.75, flexShrink: 0 }}
                />
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
      setT(Math.max(0, Math.min(1, raw)));
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
  const closed = t > 0.62;
  const closing = t > 0.55 && !closed;
  const closeScale = closing ? Math.max(0, 1 - (t - 0.55) * 14) : 1;

  // Background scattered windows — extra chaos around the main browser

  return (
    <div ref={trackRef} style={{ height: '600vh', position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backgroundColor: t > 0.55 ? '#2C3E50' : '#fff',
        transition: 'background-color 0.5s',
        overflow: 'hidden',
      }}>
        {/* Earth image — grows as checkmarks light up */}
        {t > 0.5 && (() => {
          // Count how many checkmarks are lit
          const thresholds = [0.58, 0.62, 0.66, 0.70, 0.74, 0.78];
          const lit = thresholds.filter(th => t > th).length;
          const earthProgress = lit / thresholds.length; // 0 to 1

          return (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 0,
              overflow: 'hidden',
            }}>
              {/* Earth image — grows from center outward */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url(/earth.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: earthProgress * 0.5,
                transform: `scale(${1 + (1 - earthProgress) * 0.3})`,
                transition: 'all 0.6s ease-out',
              }} />
              {/* Green overlay — fades as earth reveals */}
              <div style={{
                position: 'absolute', inset: 0,
                background: '#2C3E50',
                opacity: 1 - earthProgress * 0.5,
                transition: 'opacity 0.6s ease-out',
              }} />
            </div>
          );
        })()}

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
          {/* Solution text — fades in after close */}
          <div style={{ opacity: t > 0.6 ? 1 : 0, transition: 'opacity 0.4s', position: 'absolute', inset: 0 }}>
              <span style={{
                display: 'inline-block', fontSize: 11, fontWeight: 600,
                textTransform: 'uppercase' as const, letterSpacing: '0.1em',
                color: 'var(--sage-300)', marginBottom: 20,
              }}>
                Introducing Carelu
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)',
                fontWeight: 400, lineHeight: 1.12, color: '#fff', maxWidth: 640, margin: '0 auto 16px',
              }}>
                One platform. Every channel. Always on.
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
                Carelu is AI intake infrastructure that makes sure every family who can receive care does.
              </p>
            </div>

          {/* Spacer for layout height */}
          <div style={{ visibility: 'hidden' }}>
            <span style={{ display: 'inline-block', fontSize: 11, marginBottom: 20 }}>&nbsp;</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, lineHeight: 1.12, maxWidth: 640, margin: '0 auto 16px' }}>&nbsp;<br />&nbsp;</h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>&nbsp;</p>
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
        <div style={{ width: '100%', maxWidth: 950, position: 'relative', zIndex: 5, margin: '0 auto' }}>
          <div style={{
            background: '#f0f0f0', borderRadius: 12, overflow: 'hidden',
            boxShadow: '0 16px 80px rgba(0,0,0,0.18)', border: '1px solid #ccc',
          }}>
            {/* Title bar */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', background: '#e4e4e4', gap: 10 }}>
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

          {/* Stacked app windows ON TOP — layered over the browser */}
          {[
            { name: 'Slack - #intake-team', left: '-5%', top: '-52%', w: 230, h: 200, z: 4, content: (
              <div style={{ padding: 8 }}>
                {[{ u: 'Sarah', m: 'Did anyone call back the Thompson family?', t: '2:14 PM' }, { u: 'Mike', m: 'I thought Rachel was handling it', t: '2:16 PM' }, { u: 'Rachel', m: 'Which one? I have 6 pending', t: '2:18 PM' }].map((msg, j) => (
                  <div key={j} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 8, color: '#999' }}><span style={{ fontWeight: 700, color: '#333' }}>{msg.u}</span> {msg.t}</div>
                    <div style={{ fontSize: 9, color: '#555', marginTop: 1 }}>{msg.m}</div>
                  </div>
                ))}
              </div>
            )},
            { name: 'WhatsApp Web', left: '55%', top: '-60%', w: 220, h: 190, z: 4, content: (
              <div style={{ padding: 8 }}>
                {['Mom: Is my son on the waitlist?', 'Mom: Hello??', 'Mom: I called twice yesterday', 'Mom: Should I try another clinic?'].map((m, j) => (
                  <div key={j} style={{ background: j < 3 ? '#dcf8c6' : '#fff', borderRadius: 6, padding: '4px 8px', fontSize: 9, color: '#333', marginBottom: 4, maxWidth: '85%', marginLeft: j < 3 ? 'auto' : 0 }}>{m}</div>
                ))}
              </div>
            )},
            { name: 'Microsoft Teams', left: '88%', top: '65%', w: 210, h: 180, z: 4, content: (
              <div style={{ padding: 8 }}>
                <div style={{ fontSize: 8, color: '#999', marginBottom: 6 }}>Intake Standup - 3 participants</div>
                {['23 families in pipeline', '7 missing insurance cards', '4 awaiting diagnosis', '11 no follow-up in 5+ days'].map((l, j) => (
                  <div key={j} style={{ fontSize: 9, color: j > 1 ? '#c00' : '#555', marginBottom: 4 }}>{l}</div>
                ))}
              </div>
            )},
            { name: 'Outlook - Calendar', left: '-15%', top: '88%', w: 225, h: 185, z: 4, content: (
              <div style={{ padding: 6 }}>
                {['9:00 - Parent callback (overdue)', '10:30 - Insurance follow-up x3', '1:00 - DocuSign reminders', '2:30 - Fax Dr. Patel AGAIN'].map((e, j) => (
                  <div key={j} style={{ fontSize: 9, padding: '4px 6px', borderLeft: `3px solid ${j === 0 ? '#c00' : j === 3 ? '#f80' : '#4A7C3F'}`, marginBottom: 5, color: '#444' }}>{e}</div>
                ))}
              </div>
            )},
            { name: 'Notion - SOPs', left: '45%', top: '135%', w: 200, h: 150, z: 4, content: (
              <div style={{ padding: 8 }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: '#333', marginBottom: 6 }}>Intake Process v4.2</div>
                <div style={{ fontSize: 8, color: '#999' }}>Last updated: 3 months ago</div>
                <div style={{ fontSize: 8, color: '#c00', marginTop: 4 }}>!! Nobody follows this !!</div>
              </div>
            )},
          ].map((win, i) => (
            <div key={`stack${i}`} style={{
              position: 'absolute', left: win.left, top: win.top, width: win.w, height: win.h,
              background: '#fff', borderRadius: 8, border: '1px solid #ddd',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              zIndex: win.z, overflow: 'hidden',
            }}>
              <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f8f8' }}>
                {win.name}
                <span style={{ color: '#ccc', fontSize: 9 }}>x</span>
              </div>
              {win.content}
            </div>
          ))}

          {/* Extra scattered windows — some peeking over the main browser edges */}
          {[
            { name: 'Google Forms', left: '35%', top: '-65%', w: 200, h: 140 },
            { name: 'Fax Machine', left: '60%', top: '-55%', w: 180, h: 130 },
            { name: 'Phone Log', left: '60%', top: '135%', w: 180, h: 125 },
          ].map((w, i) => (
            <div key={`extra${i}`} style={{
              position: 'absolute', left: w.left, top: w.top, width: w.w, height: w.h,
              background: '#fff', borderRadius: 8, border: '1px solid #ddd',
              boxShadow: '0 3px 16px rgba(0,0,0,0.08)', zIndex: 2,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '5px 8px', borderBottom: '1px solid #eee', fontSize: 9, fontWeight: 600, color: '#555', display: 'flex', justifyContent: 'space-between', background: '#f8f8f8' }}>
                {w.name}
                <span style={{ color: '#ccc', fontSize: 8 }}>x</span>
              </div>
              <div style={{ padding: 8 }}>
                {[0, 1, 2, 3].map(j => (
                  <div key={j} style={{ height: 6, background: j === 0 ? '#e8e8e8' : '#f3f3f3', borderRadius: 3, marginBottom: 5, width: `${45 + j * 14}%` }} />
                ))}
              </div>
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
        </div>
        </div>
        )}

        {/* Horizontal stage pipeline -- checkmarks light up one by one */}
        {t > 0.52 && (
          <div style={{
            position: 'absolute', top: '72%', left: 0, right: 0, zIndex: 8,
            display: 'flex', justifyContent: 'center',
            opacity: t > 0.65 ? 1 : 0, transition: 'opacity 0.3s',
            padding: '0 24px',
          }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', maxWidth: 800, width: '100%', margin: '0 auto' }}>
              {/* Background connecting line */}
              <div style={{ position: 'absolute', top: 28, left: '8%', right: '8%', height: 2, background: 'rgba(255,255,255,0.06)', zIndex: 0 }} />
              {[
                { label: 'Insurance card', threshold: 0.58 },
                { label: 'Consent forms', threshold: 0.62 },
                { label: 'Diagnosis', threshold: 0.66 },
                { label: 'Follow-up', threshold: 0.70 },
                { label: 'Eligibility', threshold: 0.74 },
                { label: 'Scheduling', threshold: 0.78 },
              ].map((item, i, arr) => {
                const visible = t > item.threshold;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', flex: '1 1 0', minWidth: 0 }}>
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                      width: '100%',
                    }}>
                      {/* Glowing checkmark — bigger glow */}
                      <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        background: visible ? 'rgba(58, 138, 176, 0.9)' : 'rgba(255,255,255,0.06)',
                        border: visible ? '2.5px solid rgba(58, 138, 176, 0.5)' : '2px solid rgba(255,255,255,0.1)',
                        boxShadow: visible ? '0 0 30px rgba(58, 138, 176, 0.5), 0 0 60px rgba(58, 138, 176, 0.2), 0 0 100px rgba(58, 138, 176, 0.08)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: visible ? 'scale(1)' : 'scale(0.7)',
                      }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                          stroke={visible ? '#fff' : 'rgba(255,255,255,0.12)'}
                          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                          style={{ transition: 'stroke 0.3s' }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600,
                        color: visible ? '#fff' : 'rgba(255,255,255,0.12)',
                        transition: 'color 0.3s',
                        textAlign: 'center', whiteSpace: 'nowrap',
                      }}>
                        {item.label}
                      </span>
                    </div>
                    {/* Connecting line -- hidden, using background line instead */}
                    {i < arr.length - 1 && (
                      <div style={{
                        display: 'none',
                      }} />
                    )}
                  </div>
                );
              })}
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const GAP = 16;


  // On mount, scroll to the middle copy so we can go both directions
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const singleSetWidth = (el.scrollWidth / 3);
    el.scrollLeft = singleSetWidth;
  }, []);

  // After any scroll animation, silently reset to middle copy if we drifted into first/last copy
  const resetIfNeeded = () => {
    const el = scrollRef.current;
    if (!el) return;
    const singleSetWidth = el.scrollWidth / 3;
    setTimeout(() => {
      if (el.scrollLeft < singleSetWidth * 0.25) {
        el.style.scrollBehavior = 'auto';
        el.scrollLeft += singleSetWidth;
        el.style.scrollBehavior = '';
      } else if (el.scrollLeft > singleSetWidth * 1.75) {
        el.style.scrollBehavior = 'auto';
        el.scrollLeft -= singleSetWidth;
        el.style.scrollBehavior = '';
      }
    }, 400);
  };

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const cardW = el.querySelector('div')?.offsetWidth ?? 320;
    el.scrollBy({ left: dir === 'left' ? -(cardW + GAP) : cardW + GAP, behavior: 'smooth' });
    resetIfNeeded();
  };

  // Triple the stories for infinite loop
  const tripled = [...customerStories, ...customerStories, ...customerStories];

  return (
    <section style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
      <div style={W}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <Pill>Customer stories</Pill>
          <h2 className="rv-scale" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.12 }}>
            Hear from teams who trust Carelu.
          </h2>
          <p className="rv d1" style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', maxWidth: 480, margin: '16px auto 0' }}>
            Leaders across ABA, behavioral health, and home care are transforming their intake operations.
          </p>
        </div>

        {/* Tall portrait cards -- Brellium style with photos */}
        <div ref={scrollRef} className="stories-row" style={{ display: 'flex', gap: 16, overflow: 'hidden', paddingBottom: 8 }}>
          {tripled.map((story, i) => (
            <div key={`${story.name}-${i}`} style={{
              borderRadius: 'var(--radius)',
              flex: '0 0 calc(25% - 12px)', minWidth: 250,
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              minHeight: 460,
              scrollSnapAlign: 'start',
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.12)',
            }}>
              {/* Portrait photo */}
              <img src={story.photo} alt={story.name}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
              {/* Dark gradient overlay -- heavier at bottom for text readability */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 10%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.85) 100%)', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', zIndex: 1, padding: '32px 24px 28px' }}>
                {/* Company logo */}
                <img src={story.logo} alt={story.company}
                  style={{ height: 28, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.85, marginBottom: 20 }}
                />
                {/* Quote */}
                <blockquote style={{
                  fontSize: 14, fontStyle: 'normal', lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.92)', margin: '0 0 20px', fontWeight: 500,
                }}>
                  "{story.quote}"
                </blockquote>
                {/* Person */}
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#fff' }}>{story.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.55)' }}>{story.role}, {story.company}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 32 }}>
          {(['left', 'right'] as const).map(dir => (
            <button key={dir} onClick={() => scroll(dir)} aria-label={`Scroll ${dir}`} style={{
              width: 48, height: 48, borderRadius: '50%', border: '1.5px solid var(--green-900)',
              background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .2s, color .2s', color: 'var(--green-900)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--green-900)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--green-900)'; }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {dir === 'left'
                  ? <path d="M12.5 15L7.5 10L12.5 5" />
                  : <path d="M7.5 5L12.5 10L7.5 15" />
                }
              </svg>
            </button>
          ))}
        </div>

        {/* Proof stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, marginTop: 64, borderTop: '1px solid var(--gray-200)', paddingTop: 40 }}>
          {[
            { stat: '60% → 15%', desc: 'Family drop-off rate, first month with Carelu' },
            { stat: '0 missed', desc: 'Every lead followed up -- no one falls through the cracks' },
            { stat: '24 / 7', desc: 'Nights, weekends, holidays -- never miss a family' },
          ].map((s, i) => (
            <div key={s.stat} className={`rv d${i + 1}`} style={{ padding: '0 24px', borderLeft: i > 0 ? '1px solid var(--gray-200)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--green-900)', marginBottom: 8 }}>{s.stat}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
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


  return (
    <>
    {/* Video section — visual first */}
    <section style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)', background: '#fff' }}>
      <div style={W}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Pill>See it in action</Pill>
          <h2 className="rv-scale" style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)',
            fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.12,
          }}>
            Watch it work.
          </h2>
        </div>
        <div className="rv-scale" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 20, overflow: 'hidden', boxShadow: '0 16px 60px rgba(0,0,0,0.1)' }}>
          <video
            ref={videoRef}
            controls muted loop playsInline
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            <source src="https://framerusercontent.com/assets/ZEFznJK3xO8gPZ8psOliFXvKwO0.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>

    {/* Scale your practice — sky continuation, frosted glass cards */}
    <section style={{ position: 'relative', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)', overflow: 'hidden' }}>
      {/* Faded sky background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/sky.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 60%',
        opacity: 0.3,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, var(--white) 0%, rgba(255,255,255,0.7) 20%, rgba(255,255,255,0.7) 80%, var(--white) 100%)',
      }} />

      <div style={{ ...W, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <Pill>How it works</Pill>
          <h2 className="rv-scale" style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)',
            fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.12,
          }}>
            Scale your practice on your terms.
          </h2>
        </div>

        {/* Alternating content blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
          {[
            {
              title: 'Every channel. One inbox.',
              desc: 'Phone calls, texts, web forms, faxes, emails -- Carelu answers all of them instantly, 24/7, in English and Spanish. Families get a response in seconds, not days.',
              mockup: (
                <div style={{ position: 'relative', width: 340, height: 340, margin: '0 auto' }}>
                  {/* Ring */}
                  <svg viewBox="0 0 340 340" style={{ position: 'absolute', inset: 0 }}>
                    <circle cx="170" cy="170" r="135" fill="none" stroke="var(--sage-200)" strokeWidth="1.5" />
                    {/* Connecting lines */}
                    {[0,1,2,3,4,5].map(i => {
                      const a = (-90 + i * 60) * (Math.PI / 180);
                      return <line key={i} x1="170" y1="170" x2={170 + Math.cos(a) * 135} y2={170 + Math.sin(a) * 135} stroke="var(--sage-200)" strokeWidth="1" strokeDasharray="4 4" />;
                    })}
                    {/* Animated dots */}
                    {[0,1,2,3,4,5].map(i => {
                      const a = (-90 + i * 60) * (Math.PI / 180);
                      const sx = 170 + Math.cos(a) * 135;
                      const sy = 170 + Math.sin(a) * 135;
                      return (
                        <circle key={`d${i}`} r="4" fill="#3a8ab0">
                          <animate attributeName="cx" values={`${sx};170`} dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.35}s`} />
                          <animate attributeName="cy" values={`${sy};170`} dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.35}s`} />
                          <animate attributeName="opacity" values="0;0.6;0.3;0" dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.35}s`} />
                        </circle>
                      );
                    })}
                  </svg>
                  {/* Center */}
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 90, height: 90, borderRadius: '50%', background: '#3a8ab0',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(26,46,31,0.15)',
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.06em' }}>ALL</span>
                    <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>CHANNELS</span>
                  </div>
                  {/* Channel nodes */}
                  {['Phone', 'Text', 'Chat', 'Forms', 'Fax', 'Email'].map((ch, i) => {
                    const a = (-90 + i * 60) * (Math.PI / 180);
                    const x = 170 + Math.cos(a) * 135;
                    const y = 170 + Math.sin(a) * 135;
                    return (
                      <div key={ch} style={{
                        position: 'absolute', left: x - 30, top: y - 30,
                        width: 60, height: 60, borderRadius: '50%',
                        background: '#fff', border: '1.5px solid var(--sage-200)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        fontSize: 12, fontWeight: 600, color: '#3a8ab0',
                      }}>
                        {ch}
                      </div>
                    );
                  })}
                </div>
              ),
            },
            {
              title: 'Qualifies and collects. Automatically.',
              desc: 'Carelu knows your insurance panels, service areas, and open capacity. It verifies eligibility, collects insurance cards, gathers consent forms -- all through natural conversation.',
              reverse: true,
              mockup: (
                <div style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', borderRadius: 20, padding: '28px 24px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#3a8ab0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sage-300)' }} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green-900)' }}>Jake M. -- Intake in progress</div>
                  </div>
                  {[
                    { label: 'Insurance verified', status: 'Blue Cross PPO', done: true },
                    { label: 'Insurance card', status: 'Uploaded via text', done: true },
                    { label: 'Consent form', status: 'Signed', done: true },
                    { label: 'Diagnosis report', status: 'Requested from Dr. Patel', done: false, pending: true },
                    { label: 'HIPAA authorization', status: 'Sent -- awaiting signature', done: false, pending: true },
                  ].map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: j < 4 ? '1px solid var(--gray-200)' : 'none' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--green-900)' }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: '#999', marginTop: 1 }}>{item.status}</div>
                      </div>
                      {item.done ? (
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#3a8ab0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                      ) : (
                        <div style={{ fontSize: 10, color: '#f80', fontWeight: 600, background: '#fff8f0', padding: '3px 8px', borderRadius: 100 }}>In progress</div>
                      )}
                    </div>
                  ))}
                </div>
              ),
            },
            {
              title: 'Follows up and delivers. Zero handoff.',
              desc: 'Missing documents? Carelu nudges. Doctor hasn\'t responded? It follows up. When everything is collected and signed, Carelu schedules the assessment. Your team opens a complete, ready case.',
              mockup: (
                <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', borderRadius: 20, padding: '28px 24px', border: '2px solid rgba(255,255,255,0.6)', position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                  <div style={{ position: 'absolute', top: -12, left: 24, background: '#3a8ab0', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 14px', borderRadius: 100 }}>Ready for assessment</div>
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--green-900)', marginBottom: 4 }}>Jake M., age 4</div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>Blue Cross PPO -- ABA Therapy -- Miami, FL</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {['Insurance verified', 'Consent signed', 'Diagnosis on file', 'HIPAA authorized', 'Eligibility confirmed', 'Assessment scheduled'].map((item, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#3a8ab0' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3a8ab0" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ),
            },
          ].map((block, i) => (
            <div key={i} className="mobile-stack rv" style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center',
              direction: (block as {reverse?: boolean}).reverse ? 'rtl' : 'ltr',
            }}>
              <div style={{ direction: 'ltr' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 32px)',
                  fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.15, marginBottom: 16,
                }}>
                  {block.title}
                </h3>
                <p style={{ fontSize: 16, color: '#666', lineHeight: 1.7, margin: 0 }}>
                  {block.desc}
                </p>
              </div>
              <div style={{ direction: 'ltr' }}>
                {block.mockup}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    </>
  );
}

// ── IMPACT — neighborhood background, no animation ──
function Impact() {
  return (
    <section style={{ position: 'relative', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/neighborhood.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(44,62,80,0.72)' }} />

      <div style={{ ...W, position: 'relative', zIndex: 1 }}>
        <Pill dark>Proven Results</Pill>
        <h2 className="rv-scale" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: '#fff', marginBottom: 48 }}>
          The results speak louder than we can.
        </h2>
        <div style={{ color: '#fff' }}>
          <LiveCounter />
        </div>

        <div className="impact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { v: 3, s: '\u00d7', t2: 'More families admitted', d: 'Same team. Same hours. Triple the output.' },
            { v: 10, s: ' min', t2: 'First contact to intake-ready', p: '<', d: 'What used to take 3-5 days.' },
            { v: 85, s: '%', t2: 'Family completion rate', d: 'Industry average is under 30%.' },
            { v: 0, s: '', t2: 'Manual follow-ups', d: 'Your team focuses on care, not chasing.' },
          ].map((s, i) => (
            <div key={s.t2} className={`rv-scale d${i + 1}`} style={{
              background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius)',
              padding: '44px 28px', border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4vw, 52px)', color: '#fff', lineHeight: 1, marginBottom: 12 }}>
                <Counter target={s.v} suffix={s.s} prefix={s.p || ''} />
              </div>
              <div style={{ fontWeight: 600, color: '#fff', fontSize: 14, marginBottom: 6 }}>{s.t2}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{s.d}</div>
            </div>
          ))}
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
    <section id="faq" style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
      <div style={W}>
        <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 80 }}>
          <div className="rv-left">
            <Pill>Questions</Pill>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.12, marginBottom: 16 }}>
              Let's clear things up.
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', lineHeight: 1.6 }}>
              Still have questions? <a href="mailto:hello@carelu.ai" style={{ color: 'var(--green-700)', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}>We're real humans -- just ask.</a>
            </p>
          </div>
          <div>
            {faqs.map((f, i) => (
              <div key={i} className={`rv-right d${Math.min(i + 1, 5)}`} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} aria-label={`${open === i ? 'Collapse' : 'Expand'}: ${f.q}`} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '26px 0', border: 'none', background: 'none', textAlign: 'left', gap: 16 }}>
                  <span style={{ fontSize: 'var(--text-body)', fontWeight: 500, color: 'var(--black)' }}>{f.q}</span>
                  <span aria-hidden="true" style={{ fontSize: 20, color: 'var(--gray-400)', transition: 'transform 0.3s var(--ease-dramatic)', display: 'inline-block', transform: open === i ? 'rotate(45deg)' : 'none', flexShrink: 0 }}>+</span>
                </button>
                <div style={{ maxHeight: open === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.5s var(--ease-dramatic)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', lineHeight: 1.7, paddingBottom: 26 }}>{f.a}</p>
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
  return (
    <>
      <section id="cta" style={{ padding: '0 36px 36px' }}>
        <div className="cta-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, maxWidth: 1200, margin: '0 auto' }}>
          <div className="rv-left" style={{ background: 'var(--bone)', borderRadius: 'var(--radius)', padding: 'clamp(48px, 6vw, 72px)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.12, marginBottom: 20 }}>
              Somewhere right now, a parent is searching for <span style={{ color: 'var(--green-700)', fontStyle: 'italic' }}>care</span> for their child.
            </h2>
            <p style={{ fontSize: 'var(--text-body)', color: 'var(--gray-500)', lineHeight: 1.7, maxWidth: 460 }}>
              Let's make sure they find you -- and that when they do, someone's there.
            </p>
          </div>
          <a href="/demo" style={{
            background: 'var(--green-700)', borderRadius: 'var(--radius)', padding: '44px 40px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            textDecoration: 'none', transition: 'background-color 0.3s, transform 0.3s',
            position: 'relative', overflow: 'hidden', minHeight: 220,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--green-600)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--green-700)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {/* Subtle gradient overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.04) 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)', letterSpacing: '1px', textTransform: 'uppercase' }}>Live in 2 weeks · No engineering needed</span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 36px)', color: '#fff', marginTop: 16, lineHeight: 1.15 }}>
                See how it works for your practice.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>Request a Demo</span>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          </a>
        </div>
      </section>
      <footer style={{ ...W, padding: '48px 36px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="dot-pulse" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--green-600)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, color: 'var(--gray-400)', letterSpacing: '-0.6px' }}>carelu</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>HIPAA Compliant</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>SOC 2 Type II</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>© 2026 Carelu, Inc.</span>
        </div>
      </footer>
    </>
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
      <CustomerStories />
      <HowCarelu />
      <Impact />
      <Compliance />
      <Faq />
      <CtaFooter />
    </>
  );
}
