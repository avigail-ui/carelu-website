import { useState, useEffect, useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import NavDropdown from '../components/NavDropdown';

// ── LIVE FAMILY COUNTER — grows ~200/day from a fixed baseline ──
// ── LIVE FAMILY COUNT ──
const BASELINE_DATE = new Date('2026-04-16T00:00:00Z').getTime();
const BASELINE_COUNT = 35000;
const GROWTH_PER_MS = 500 / (24 * 60 * 60 * 1000);

function getLiveCount() {
  return Math.floor(BASELINE_COUNT + Math.max(0, Date.now() - BASELINE_DATE) * GROWTH_PER_MS);
}

// ── LIVE COUNTER — ticks up in real time ──
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
        color: 'var(--green-800)',
        lineHeight: 1,
        letterSpacing: '-3px',
      }}>
        {count.toLocaleString()}+
      </div>
      <div style={{ fontSize: 'var(--text-h3)', color: 'var(--gray-500)', marginTop: 8, marginBottom: 12 }}>
        families connected to care
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span className="dot-pulse" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--green-600)', display: 'inline-block' }} />
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--green-700)', fontWeight: 600 }}>Live</span>
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




// ── SPLIT WORDS — wraps words in staggered spans ──
function SplitWords({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          className="hero-word"
          style={{ animationDelay: `${baseDelay + i * 0.12}s`, marginRight: '0.25em' }}
        >
          {word}
        </span>
      ))}
    </>
  );
}



/* ============================================================
   CARELU — ORIGINAL VERSION
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

function TypingDots() {
  return <div className="typing-indicator"><span /><span /><span /></div>;
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

            {/* CTA — always visible */}
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
      background: 'linear-gradient(180deg, var(--bone) 0%, var(--white) 100%)',
    }}>
      {/* Soft ambient orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="orb-drift-1" style={{ position: 'absolute', width: 600, height: 600, top: -100, right: -100, borderRadius: '50%', background: 'radial-gradient(circle, var(--sage-100) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.8 }} />
        <div className="orb-drift-2" style={{ position: 'absolute', width: 400, height: 400, bottom: 50, left: -50, borderRadius: '50%', background: 'radial-gradient(circle, var(--linen) 0%, transparent 70%)', filter: 'blur(60px)', opacity: 0.6 }} />
      </div>

      {/* Decorative bottom curve */}
      <svg style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', height: 60, zIndex: 2 }} preserveAspectRatio="none" viewBox="0 0 1440 60">
        <path d="M0 60 C480 0 960 0 1440 60 L1440 60 L0 60Z" fill="var(--white)" />
      </svg>

      <div className="mobile-stack" style={{ ...W, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div className="hero-content-mobile">
          <span className="rv hero-line" style={{
            display: 'inline-block', fontSize: 13, fontWeight: 500,
            color: 'var(--green-800)', background: 'var(--sage-100)',
            borderRadius: 'var(--radius-pill)', padding: '8px 20px',
            border: '1px solid var(--sage-200)', marginBottom: 28,
          }}>The World's First Care Enablement Platform</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-hero)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-2px', color: 'var(--green-900)', marginBottom: 28, perspective: 1000 }}>
            <div style={{ display: 'block' }}>
              <SplitWords text="Fewer families lost." baseDelay={0.1} />
            </div>
            <div style={{ display: 'block' }}>
              <SplitWords text="More care" baseDelay={0.5} />
              {' '}
              <span
                className="hero-word"
                style={{ animationDelay: '0.9s', fontStyle: 'italic', display: 'inline-block', color: 'var(--green-600)' }}
              >delivered.</span>
            </div>
          </h1>
          <p className="hero-sub" style={{ fontSize: 18, color: 'var(--gray-600)', lineHeight: 1.75, maxWidth: 480, marginBottom: 44 }}>
            Carelu runs your entire intake operation — calls, forms, texts, chats, faxes — from first contact to admitted patient. No family slips through the cracks.
          </p>
          <div className="hero-cta">
            <a href="/demo" className="btn-primary hero-cta-btn" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontSize: 20, fontWeight: 600, color: '#fff',
              backgroundColor: 'var(--green-900)', padding: '24px 32px',
              borderRadius: 18, textDecoration: 'none', maxWidth: 380,
              transition: 'background-color 0.3s, transform 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--green-700)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--green-900)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Request a Demo
              <span style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </a>
            <span className="hide-mobile" style={{ fontSize: 'var(--text-xs)', color: 'var(--stone)', marginTop: 14, display: 'block' }}>Setup in days, not months</span>
          </div>
        </div>

        {/* Hero visual — dark product card */}
        <div className="hero-visual" style={{ maxWidth: 400 }}>
          <div className="card-lift" style={{
            background: 'var(--green-900)', borderRadius: 28,
            padding: '36px 32px', position: 'relative', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(26,46,31,0.25), 0 4px 12px rgba(26,46,31,0.1)',
          }}>
            {/* Subtle glow in corner */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,124,63,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, position: 'relative' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="dot-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sage-300)', display: 'block' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Carelu AI</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Processing intake...</div>
              </div>
              <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#5E9462' }} />
            </div>

            {/* Progress bar */}
            <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', marginBottom: 24, overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, var(--green-700), var(--sage-300))', animation: 'shimmer 2s ease infinite' }} />
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { text: 'Family reached out', delay: '0.5s' },
                { text: 'Insurance verified', delay: '0.9s' },
                { text: 'Documents collected', delay: '1.3s' },
                { text: 'Ready for assessment', delay: '2.2s', highlight: true },
              ].map((step) => (
                <div key={step.text} className="hero-chat-msg" style={{ animationDelay: step.delay,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 14,
                  background: step.highlight ? 'rgba(94,148,98,0.15)' : 'rgba(255,255,255,0.05)',
                  border: step.highlight ? '1px solid rgba(94,148,98,0.3)' : '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{
                    fontSize: 13, fontWeight: step.highlight ? 600 : 400,
                    color: step.highlight ? '#fff' : 'rgba(255,255,255,0.7)',
                  }}>{step.text}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke={step.highlight ? 'var(--sage-300)' : 'rgba(255,255,255,0.3)'}
                    strokeWidth="2.5" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
              ))}
            </div>

            {/* Channel badges */}
            <div style={{ display: 'flex', gap: 6, marginTop: 20, flexWrap: 'wrap' }}>
              {['Chat', 'Phone', 'SMS', 'Forms', 'Fax'].map((ch) => (
                <span key={ch} style={{
                  fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.06)', padding: '5px 12px',
                  borderRadius: 999, letterSpacing: '0.3px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>{ch}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

// ── MARQUEE ──────────────────────────────────────
function Marquee() {
  const items = ['AI-Powered Intake', 'HIPAA Compliant', 'Insurance Verification', 'ABA Therapy', 'Behavioral Health', '24/7 Availability', 'Document Collection', 'Zero Drop-Off', 'Home Care', 'Addiction Treatment'];
  const text = items.map((i) => `${i}  ·  `).join('');
  // Render 4 copies so even on very wide screens there's never a visible gap.
  // The CSS keyframe animates from 0 to -50% which equals exactly 2 copies shifting off-screen,
  // while the other 2 copies are always visible → seamless infinite loop.
  return (
    <div style={{ borderTop: '1px solid var(--gray-200)', borderBottom: '1px solid var(--gray-200)', padding: '18px 0', overflow: 'hidden', userSelect: 'none' }}>
      <div className="marquee-track">
        {[0, 1, 2, 3].map((copyIdx) => (
          <span key={copyIdx} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 500, letterSpacing: '0.5px', whiteSpace: 'nowrap', color: 'var(--stone)' }}>
            {items.map((item, i) => (
              <span key={i}>{item}<span style={{ margin: '0 20px', opacity: 0.3 }}>·</span></span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── LOGO BAR — cycling logos ────────────────────
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
    <div style={{ padding: '56px 0', borderBottom: '1px solid var(--gray-200)' }}>
      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--gray-500)', textAlign: 'center', marginBottom: 40, fontStyle: 'italic' }}>
        Trusted by behavioral health providers nationwide
      </p>
      <div style={{ overflow: 'hidden' }}>
        <div className="marquee-track" style={{ animation: 'marqueeScroll 50s linear infinite' }}>
          {[0, 1].map((set) => (
            <div key={set} style={{ display: 'flex', alignItems: 'center', gap: 80, paddingRight: 80 }}>
              {allLogos.map((logo) => (
                <img
                  key={`${set}-${logo.alt}`}
                  src={logo.src}
                  alt={logo.alt}
                  style={{ height: 48, width: 'auto', objectFit: 'contain', opacity: 0.75, flexShrink: 0 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PROBLEM ─────────────────────────────────────
function Problem() {
  return (
    <section style={{ backgroundColor: 'var(--green-900)', color: '#fff', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)', position: 'relative', overflow: 'hidden' }}>
      <div style={W}>
        {/* Giant background number — Apple-style drama */}

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Headline + story — full width */}
          <div className="rv-left"><Pill dark>What's actually happening</Pill></div>
          <h2 className="rv-left d1" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, lineHeight: 1.12, color: '#fff', maxWidth: 620, marginBottom: 36 }}>
            Your intake reps are chasing.<br />It's never enough.
          </h2>

          <div className="rv-left d2" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
            {['Voicemails pile up', 'Diagnoses aren\'t received', 'Forms sit half-finished', 'Consent forms aren\'t signed'].map((line, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 100,
                background: '#fff',
                fontSize: 14, color: 'var(--green-900)', fontWeight: 500,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-700)', flexShrink: 0 }} />
                {line}
              </span>
            ))}
          </div>

          <p className="rv-left d3" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2vw, 22px)', color: '#fff', lineHeight: 1.4, margin: '0 0 64px', maxWidth: 480 }}>
            While you're trying to reach them, they've already called someone else.
          </p>

          {/* Stats — horizontal row below, full width */}
          <div className="mobile-stack rv d4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 36 }}>
            {[
              { val: '70%', desc: 'of families abandon intake before completion' },
              { val: '5+', desc: 'tools duct-taped together to manage one process' },
              { val: 'Days', desc: 'spent chasing documents and playing phone tag' },
            ].map((s, i) => (
              <div key={i} style={{
                paddingRight: 32,
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                paddingLeft: i > 0 ? 32 : 0,
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4vw, 48px)', color: '#fff', lineHeight: 1, marginBottom: 8 }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SOLUTION BRIDGE ─────────────────────────────
function Promise() {
  return (
    <section style={{ background: 'linear-gradient(to bottom, var(--sage-200), var(--white))', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
      <div style={W}>
        <Pill>The solution</Pill>
        <h2 className="rv-scale" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, lineHeight: 1.12, color: 'var(--green-900)', maxWidth: 720 }}>
          Carelu replaces your entire intake workflow with one AI-powered platform — from first contact to admitted patient.
        </h2>
      </div>
    </section>
  );
}

// ── APPLE-STYLE: Big 3D sphere, typography does the work ──
function HubDiagram() {
  return (
    <>
      <section style={{ background: 'var(--bone)', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
        <div style={W}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <Pill>How it works</Pill>
            <h2 className="rv-scale" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.12 }}>
              One platform. Every channel. Always on.
            </h2>
          </div>

          {/* Channel pills + sphere + exit dots — single centered column */}
          <div className="rv-scale" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 48 }}>
            {/* Channel pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
              {['Phone', 'Text', 'Chat', 'Forms', 'Fax'].map(ch => (
                <span key={ch} style={{
                  padding: '8px 20px', borderRadius: 100,
                  border: '1px solid var(--sage-200)', background: '#fff',
                  fontSize: 13, fontWeight: 600, color: 'var(--green-800)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>{ch}</span>
              ))}
            </div>

            {/* Single SVG: channels flow in → sphere → process labels → intake-ready */}
            <svg viewBox="0 0 400 440" style={{ width: '100%', maxWidth: 420, height: 'auto' }}>
              <defs>
                <radialGradient id="sphere" cx="36%" cy="33%" r="55%">
                  <stop offset="0%" stopColor="#6B8F6E" />
                  <stop offset="35%" stopColor="#3A5A3C" />
                  <stop offset="100%" stopColor="#1A2E1F" />
                </radialGradient>
                <radialGradient id="sphereShadow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1A2E1F" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#1A2E1F" stopOpacity="0" />
                </radialGradient>
                {/* Inbound: channel positions → sphere center */}
                {[44, 112, 200, 288, 356].map((sx, i) => (
                  <path key={`ip${i}`} id={`ip${i}`} d={`M${sx},0 C${sx},40 200,80 200,130`} fill="none" />
                ))}
                {/* Outbound: sphere → each process label */}
                {[
                  'M200,195 Q130,230 75,260',
                  'M200,195 Q180,230 175,260',
                  'M200,195 Q250,230 300,260',
                  'M200,195 Q120,270 90,300',
                  'M200,195 Q200,275 195,300',
                  'M200,195 Q270,270 305,300',
                ].map((d, i) => (
                  <path key={`op${i}`} id={`op${i}`} d={d} fill="none" />
                ))}
                {/* Converge: each label → intake-ready */}
                {[
                  'M75,270 Q130,360 200,400',
                  'M175,270 Q185,350 200,400',
                  'M300,270 Q260,360 200,400',
                  'M90,310 Q140,370 200,400',
                  'M195,310 Q198,370 200,400',
                  'M305,310 Q260,370 200,400',
                ].map((d, i) => (
                  <path key={`cp${i}`} id={`cp${i}`} d={d} fill="none" />
                ))}
              </defs>

              {/* Shadow */}
              <ellipse cx="200" cy="200" rx="50" ry="6" fill="url(#sphereShadow)" />

              {/* Sphere */}
              <circle cx="200" cy="145" r="50" fill="url(#sphere)" />
              <ellipse cx="190" cy="132" rx="14" ry="9" fill="#fff" opacity="0.06" />

              {/* Pulse */}
              <circle cx="200" cy="145" r="50" fill="none" stroke="#1A2E1F" strokeWidth="0.7">
                <animate attributeName="r" values="50;60;50" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.1;0;0.1" dur="4s" repeatCount="indefinite" />
              </circle>

              {/* Logo */}
              <text x="200" y="148" textAnchor="middle" dominantBaseline="middle"
                fill="#fff" fontFamily="EB Garamond, serif" fontSize="14" fontWeight="500">carelu</text>

              {/* Inbound dots */}
              {[44, 112, 200, 288, 356].map((_, i) => (
                <circle key={`id${i}`} r="3.5" fill="#1A2E1F">
                  <animateMotion dur={`${2.2 + i * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.45}s`}>
                    <mpath href={`#ip${i}`} />
                  </animateMotion>
                  <animate attributeName="opacity" values="0;0.5;0.35;0" dur={`${2.2 + i * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.45}s`} />
                </circle>
              ))}

              {/* Outbound dots: sphere → labels */}
              {[0, 1, 2, 3, 4, 5].map(i => (
                <circle key={`od${i}`} r="2.5" fill="#1A2E1F">
                  <animateMotion dur={`${1.3 + (i % 3) * 0.15}s`} repeatCount="indefinite" begin={`${i * 0.65}s`}>
                    <mpath href={`#op${i}`} />
                  </animateMotion>
                  <animate attributeName="opacity" values="0;0.4;0.25;0" dur={`${1.3 + (i % 3) * 0.15}s`} repeatCount="indefinite" begin={`${i * 0.65}s`} />
                </circle>
              ))}

              {/* Converge dots: labels → intake-ready */}
              {[0, 1, 2, 3, 4, 5].map(i => (
                <circle key={`cd${i}`} r="2" fill="#1A2E1F">
                  <animateMotion dur={`${1.1 + (i % 3) * 0.12}s`} repeatCount="indefinite" begin={`${i * 0.65 + 0.9}s`}>
                    <mpath href={`#cp${i}`} />
                  </animateMotion>
                  <animate attributeName="opacity" values="0;0.3;0.15;0" dur={`${1.1 + (i % 3) * 0.12}s`} repeatCount="indefinite" begin={`${i * 0.65 + 0.9}s`} />
                </circle>
              ))}

              {/* Process labels — row 1, italic serif — turn green when dot hits */}
              {[
                { text: 'Insurance card', x: 75, y: 265 },
                { text: 'Consent form', x: 175, y: 265 },
                { text: 'Diagnosis', x: 300, y: 265 },
              ].map((p, i) => (
                <text key={`r1${i}`} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
                  fontFamily="EB Garamond, serif" fontSize="13" fontWeight="400" fontStyle="italic">
                  <animate attributeName="fill" values="#1A2E1F;#4A7C3F;#4A7C3F;#1A2E1F" dur="3.9s" begin={`${i * 0.65}s`} repeatCount="indefinite" keyTimes="0;0.08;0.2;0.35" />
                  <animate attributeName="opacity" values="0.5;1;1;0.5" dur="3.9s" begin={`${i * 0.65}s`} repeatCount="indefinite" keyTimes="0;0.08;0.2;0.35" />
                  {p.text}
                </text>
              ))}
              {/* Process labels — row 2 */}
              {[
                { text: 'Follow-up', x: 90, y: 305 },
                { text: 'Eligibility', x: 195, y: 305 },
                { text: 'Scheduling', x: 305, y: 305 },
              ].map((p, i) => (
                <text key={`r2${i}`} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
                  fontFamily="EB Garamond, serif" fontSize="13" fontWeight="400" fontStyle="italic">
                  <animate attributeName="fill" values="#1A2E1F;#4A7C3F;#4A7C3F;#1A2E1F" dur="3.9s" begin={`${(i + 3) * 0.65}s`} repeatCount="indefinite" keyTimes="0;0.08;0.2;0.35" />
                  <animate attributeName="opacity" values="0.5;1;1;0.5" dur="3.9s" begin={`${(i + 3) * 0.65}s`} repeatCount="indefinite" keyTimes="0;0.08;0.2;0.35" />
                  {p.text}
                </text>
              ))}

              {/* Ready for assessment */}
              <rect x="110" y="388" width="180" height="30" rx="15" fill="#1A2E1F" />
              <text x="192" y="404" textAnchor="middle" dominantBaseline="middle"
                fontFamily="DM Sans, sans-serif" fontSize="11" fontWeight="600" fill="#fff">
                Ready for assessment
              </text>
              <path d="M286 399 L290 403 L298 395" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Outcome line */}
          <div className="rv d4" style={{ textAlign: 'center', marginTop: 28, marginBottom: 64 }}>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)',
              fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.3,
              margin: '0 auto',
            }}>
              No family slips through the cracks.
            </p>
          </div>

          {/* Three-stat outcome row */}
          <div className="mobile-stack rv d4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid var(--sage-200)', paddingTop: 40 }}>
            {[
              { val: '24/7', desc: 'Every call answered, every form filled, every family followed up.' },
              { val: '85%', desc: 'Intake completion rate — up from the industry average of 30%.' },
              { val: 'Minutes', desc: 'To a fully qualified, documented, assessment-ready family.' },
            ].map((s, i) => (
              <div key={i} style={{
                paddingRight: 32, paddingLeft: i > 0 ? 32 : 0,
                borderRight: i < 2 ? '1px solid var(--sage-200)' : 'none',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4vw, 48px)', color: 'var(--green-900)', lineHeight: 1, marginBottom: 8 }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 13, color: 'var(--stone)', lineHeight: 1.5 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
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
    quote: "The follow-up alone saved us 20 hours a week. Parents get nudged for missing documents automatically — our team just reviews completed cases.",
    name: 'Michael R.',
    role: 'Regional Director',
    company: 'Blossom ABA',
  },
];

function CustomerStories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const GAP = 16;
  const COUNT = customerStories.length;

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

        {/* Tall portrait cards — Brellium style with photos */}
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
              {/* Dark gradient overlay — heavier at bottom for text readability */}
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
        <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, marginTop: 64, borderTop: '1px solid var(--gray-200)', paddingTop: 40 }}>
          {[
            { stat: '60% → 15%', desc: 'Family drop-off rate, first month with Carelu' },
            { stat: '0 missed', desc: 'Every lead followed up — no one falls through the cracks' },
            { stat: '24 / 7', desc: 'Nights, weekends, holidays — never miss a family' },
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

// ── STICKY PRODUCT TOUR — feature-based ─────────
const tourSteps = [
  {
    time: '11:14 PM',
    scenario: 'A parent texts your intake number.',
    title: 'Carelu answers. Instantly.',
    desc: "No hold music. No voicemail. No \"we'll get back to you.\" Whether it's chat, phone, SMS, a web form, or even a fax — Carelu responds in under 3 seconds with a warm, intelligent conversation in English or Spanish.",
    pills: ['Chat', 'Phone', 'SMS', 'Forms', 'Fax'],
    mockup: 'chat',
  },
  {
    time: '11:16 PM',
    scenario: '"We have Blue Cross."',
    title: 'Lead qualified. In 14 seconds.',
    desc: "Carelu checks insurance, age, diagnosis status, location, and more — all during the conversation. Qualified leads move forward instantly. Unqualified ones get flagged before your team spends a minute on them.",
    pills: ['Insurance', 'Age', 'Diagnosis', 'Location'],
    mockup: 'eligibility',
  },
  {
    time: 'Day 0 – Day 2',
    scenario: 'Every document, collected automatically.',
    title: 'Documentation handled for you.',
    desc: "Insurance cards, diagnosis reports, consent forms, HIPAA authorization — collected via text. Progress tracked automatically. Case marked intake-ready when complete.",
    pills: ['Auto-collect', 'Text uploads', 'Progress tracking'],
    mockup: 'documentation',
  },
  {
    time: 'Day 1, 9 AM',
    scenario: 'One document is still missing.',
    title: "Carelu follows up. Your team doesn't have to.",
    desc: "Friendly text nudges, reminders, and follow-ups — all automatic. Your team only sees fully prepared, ready-for-assessment cases.",
    pills: ['SMS nudges', 'Full timeline', 'Ready for assessment'],
    mockup: 'followup',
  },
];

/**
 * Sequential transition: fade out → swap content → fade in.
 * Container always wraps the displayed content exactly — no overlap, no empty space.
 */
function useSequentialSwap(value: number, fadeOutMs: number = 280) {
  const [displayed, setDisplayed] = useState(value);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  useEffect(() => {
    if (value === displayed) return;
    setPhase('out');
    const t = setTimeout(() => {
      setDisplayed(value);
      setPhase('in');
    }, fadeOutMs);
    return () => clearTimeout(t);
  }, [value, displayed, fadeOutMs]);
  return { displayed, phase };
}

function StickyTour() {
  const [activeIdx, setActiveIdx] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { displayed: mockupIdx, phase } = useSequentialSwap(activeIdx, 280);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = stepRefs.current.indexOf(entry.target as HTMLDivElement);
          if (idx !== -1) setActiveIdx(idx);
        }
      });
    }, { threshold: 0.15, rootMargin: '-35% 0px -35% 0px' });
    stepRefs.current.forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const mockups: Record<string, React.ReactNode> = {
    chat: (
      <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        {[
          { from: 'user', text: "Hi, I'm looking for ABA therapy for my son." },
          { from: 'bot', text: "I'd love to help! What insurance do you have?" },
          { from: 'user', text: "We have Aetna through my employer." },
          { from: 'bot', text: "Great — let me check your coverage right now. What's your member ID?" },
        ].map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
            <div style={{ padding: '10px 16px', borderRadius: 14, fontSize: 13, lineHeight: 1.5, maxWidth: '82%', background: m.from === 'user' ? 'var(--green-800)' : 'var(--sage-50)', color: m.from === 'user' ? '#fff' : 'var(--gray-600)' }}>{m.text}</div>
          </div>
        ))}
        <TypingDots />
      </div>
    ),
    eligibility: (
      <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--green-800)', marginBottom: 16 }}>Lead qualified — 14 seconds</div>
        {[
          'Blue Cross Blue Shield — Active',
          'ABA therapy — Covered',
          'Age eligible (4 years old)',
          'Diagnosis on file — ASD',
          'Location — Tampa, FL (in service area)',
          'In-network provider available',
        ].map((t) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '10px 14px', background: 'var(--sage-50)', borderRadius: 'var(--radius-sm)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>{t}</span>
          </div>
        ))}
      </div>
    ),
    documentation: (
      <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        {/* Progress bar */}
        <div style={{ height: 6, borderRadius: 3, background: 'var(--sage-100)', marginBottom: 24 }}>
          <div style={{ height: 6, borderRadius: 3, background: 'var(--green-600)', width: '100%' }} />
        </div>
        {[
          { name: 'Insurance card — front', icon: '📷' },
          { name: 'Insurance card — back', icon: '📷' },
          { name: 'Autism diagnosis report', icon: '📄' },
          { name: 'Consent for treatment', icon: '📄' },
          { name: 'HIPAA authorization', icon: '📄' },
        ].map((doc) => (
          <div key={doc.name} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px', marginBottom: 8,
            background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--gray-200)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--sage-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{doc.icon}</div>
              <span style={{ fontSize: 14, color: 'var(--gray-600)', fontWeight: 500 }}>{doc.name}</span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
        ))}
        {/* Final status */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', marginTop: 4,
          background: 'rgba(74, 122, 78, 0.08)', borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(74, 122, 78, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <span style={{ fontSize: 14, color: 'var(--green-700)', fontWeight: 600 }}>Case marked intake-ready</span>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
      </div>
    ),
    followup: (
      <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        {/* Browser chrome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--gray-200)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }} />
          <span style={{ fontSize: 11, color: 'var(--gray-400)', marginLeft: 8 }}>carelu.ai / bright-horizons / case-timeline</span>
        </div>
        {/* Timeline — 4 steps, no emojis */}
        {[
          { text: 'Family started intake via chat', time: 'Day 0, 3:12 PM', type: 'default' as const },
          { text: 'SMS sent: "Hi Maria, we just need Lucas\'s diagnosis report to finish up."', time: 'Day 1, 9:00 AM', type: 'nudge' as const },
          { text: 'Maria uploaded diagnosis report via text', time: 'Day 1, 11:42 AM', type: 'default' as const },
          { text: 'Ready for assessment', time: 'Day 2, 10:16 AM', type: 'success' as const },
        ].map((e, i, arr) => {
          const isSuccess = e.type === 'success';
          // Each row gets progressively more saturated green to show progress
          const rowBg = ['var(--sage-50)', 'var(--sage-100)', 'var(--sage-200)', 'var(--sage-300)'][i];
          const rowText = ['var(--gray-600)', 'var(--green-800)', 'var(--green-800)', 'var(--green-900)'][i];
          return (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              {/* Left rail: only the final row has a checkmark; others are connected by a line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                {isSuccess ? (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--green-800)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                ) : (
                  <div style={{ width: 28, height: 28 }} />
                )}
                {i < arr.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 16, background: 'var(--sage-200)' }} />}
              </div>
              <div style={{
                flex: 1, borderRadius: 'var(--radius-sm)', padding: '12px 16px',
                background: rowBg,
                border: isSuccess ? '1px solid rgba(27,46,30,0.18)' : 'none',
              }}>
                <div style={{ fontSize: 13, color: rowText, lineHeight: 1.45, fontWeight: isSuccess ? 600 : 400 }}>{e.text}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 3 }}>{e.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    ),
  };

  return (
    <section id="platform" style={{ paddingTop: 'var(--section-py)', paddingBottom: 40 }}>
      <div style={W}>
        <div className="rv-left"><Pill>See it happen</Pill></div>
        <h2 className="rv-left d1" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.12, maxWidth: 600, marginBottom: 80 }}>
          One family. One night. Start to finish.
        </h2>

        <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
          <div className="tour-sticky" style={{ position: 'sticky', top: 120, alignSelf: 'start' }}>
            <div style={{ background: 'var(--sage-50)', borderRadius: 20, padding: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08)' }}>
              {/*
                Sequential fade: current mockup fades out (280ms), content swaps,
                new mockup fades in (380ms). The card wraps the one displayed
                mockup at all times, so no empty sage-green ever shows.
              */}
              <div
                style={{
                  opacity: phase === 'out' ? 0 : 1,
                  transform: phase === 'out' ? 'translateY(6px) scale(0.99)' : 'translateY(0) scale(1)',
                  transition: phase === 'out'
                    ? 'opacity 0.28s ease-out, transform 0.28s ease-out'
                    : 'opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1), transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {mockups[tourSteps[mockupIdx].mockup]}
              </div>
            </div>
          </div>
          <div className="tour-steps-col">
            {tourSteps.map((step, i) => (
              <div key={step.title} ref={(el) => { stepRefs.current[i] = el; }}
                style={{
                  minHeight: '80vh',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  paddingBottom: i < tourSteps.length - 1 ? 80 : 0,
                  opacity: activeIdx === i ? 1 : 0.2,
                  transform: activeIdx === i ? 'none' : 'translateY(8px)',
                  transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--green-600)', letterSpacing: '1px', marginBottom: 6 }}>{step.time}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontStyle: 'italic', color: 'var(--gray-500)', marginBottom: 20 }}>{step.scenario}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', color: 'var(--green-900)', lineHeight: 1.2, marginBottom: 16 }}>{step.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: 24, maxWidth: 420 }}>{step.desc}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                  {step.pills.map((p) => (
                    <span key={p} style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: activeIdx === i ? '#fff' : 'var(--green-800)', background: activeIdx === i ? 'var(--green-800)' : 'var(--sage-100)', padding: '5px 14px', borderRadius: 'var(--radius-pill)', transition: 'background 0.3s, color 0.3s' }}>{p}</span>
                  ))}
                </div>
                {/* Inline mockup for mobile */}
                <div className="tour-mockup-inline" style={{ display: 'none', background: 'var(--sage-50)', borderRadius: 'var(--radius)', padding: 20 }}>
                  {mockups[step.mockup]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── HOW IT WORKS — clean vertical list with drawing dividers ──
// ── EVERY CHANNEL — tabbed flow panels ───────────
const channelData = [
  {
    id: 'chat',
    label: 'Chat',
    title: 'Website chat that qualifies families in real time.',
    desc: 'A parent lands on your site at 10pm. Carelu greets them, asks the right questions, verifies insurance, and collects documents — all before your team wakes up.',
    flow: [
      { from: 'bot', text: 'Hi! I\'m here to help get your child started with ABA therapy. What\'s your child\'s name?' },
      { from: 'user', text: 'His name is Lucas. He\'s 4.' },
      { from: 'bot', text: 'Great to meet Lucas! What insurance do you have?' },
      { from: 'user', text: 'Blue Cross Blue Shield' },
      { from: 'bot', text: '✓ BCBS verified — Lucas is eligible for ABA services. Let me collect a few documents to get started.' },
    ],
  },
  {
    id: 'phone',
    label: 'Phone',
    title: 'Voice AI that answers every call. Instantly.',
    desc: 'No hold music. No voicemail. No "press 1 for..." — Carelu\'s voice AI picks up in under 3 seconds, qualifies the caller, and starts intake on the spot.',
    flow: [
      { from: 'system', text: 'Incoming call — (813) 555-0147' },
      { from: 'bot', text: '"Hi, thanks for calling! I can help you get started with ABA therapy. Can I get your child\'s name?"' },
      { from: 'user', text: '"Sure, it\'s Emma. She was just diagnosed."' },
      { from: 'bot', text: '"Welcome, Emma. Let me check your insurance right now. What provider do you have?"' },
      { from: 'system', text: '✓ Insurance verified · Intake started · SMS follow-up queued' },
    ],
  },
  {
    id: 'sms',
    label: 'SMS',
    title: 'Families text your number. Carelu handles the rest.',
    desc: 'Two-way texting for intake, document uploads, and follow-up. Families send insurance cards as photos, sign consent via text, and get reminders automatically.',
    flow: [
      { from: 'user', text: 'Hi, I need help finding ABA therapy for my daughter' },
      { from: 'bot', text: 'I\'d love to help! What\'s your daughter\'s name and age?' },
      { from: 'user', text: 'Sofia, she\'s 6' },
      { from: 'bot', text: 'Welcome Sofia! Can you text me a photo of the front of your insurance card?' },
      { from: 'user', text: '[Photo uploaded]' },
      { from: 'bot', text: '✓ Aetna verified. Sofia is covered. I\'ll send you a link to complete the intake forms.' },
    ],
  },
  {
    id: 'forms',
    label: 'Forms',
    title: 'Your existing web forms, supercharged.',
    desc: 'Carelu integrates with your existing intake forms and turns every submission into an active case — triggering qualification, follow-up, and document collection automatically.',
    flow: [
      { from: 'system', text: 'New form submission — brighthorizonsaba.com/intake' },
      { from: 'system', text: 'Patient: Lucas Rivera · DOB: 03/15/2021 · Insurance: Cigna' },
      { from: 'bot', text: '→ Carelu activated: insurance verification started' },
      { from: 'bot', text: '→ Cigna verified. ABA covered. In-network.' },
      { from: 'bot', text: '→ SMS sent to family: "Hi! Just need your diagnosis report to finish up."' },
      { from: 'system', text: '✓ Document received · Case marked intake-ready' },
    ],
  },
  {
    id: 'fax',
    label: 'Fax',
    title: 'Faxed referrals read, extracted, and routed by AI.',
    desc: 'Referrals from physicians and schools arrive by fax. Carelu reads them, extracts patient data, creates an intake case, and reaches out to the family — automatically.',
    flow: [
      { from: 'system', text: 'Incoming fax — Dr. Patel\'s Office, Pediatric Referral' },
      { from: 'system', text: 'REFERRAL FOR ABA SERVICES\nPatient: Jaylen Thompson, DOB 06/22/2020\nDx: Autism Spectrum Disorder F84.0' },
      { from: 'bot', text: '→ AI extracted: patient details, diagnosis, insurance info' },
      { from: 'bot', text: '→ Case created. Family contact found. SMS sent.' },
      { from: 'system', text: '✓ Family responded · Intake in progress' },
    ],
  },
];

function EveryChannel() {
  const [active, setActive] = useState('chat');
  const channel = channelData.find((c) => c.id === active)!;

  return (
    <section style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
      <div style={W}>
        <Pill>Every channel</Pill>
        <h2 className="rv-left" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.12, maxWidth: 600, marginBottom: 48 }}>
          However they find you.
        </h2>

        {/* Channel tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
          {channelData.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActive(ch.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 20px', borderRadius: 'var(--radius-pill)',
                border: active === ch.id ? 'none' : '1px solid var(--gray-200)',
                background: active === ch.id ? 'var(--green-800)' : '#fff',
                color: active === ch.id ? '#fff' : 'var(--gray-600)',
                fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.2s',
              }}
            >
              {ch.label}
            </button>
          ))}
        </div>

        {/* Active channel panel */}
        <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, alignItems: 'start' }}>
          {/* Left: description */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', color: 'var(--green-900)', lineHeight: 1.2, marginBottom: 16 }}>
              {channel.title}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', lineHeight: 1.7 }}>
              {channel.desc}
            </p>
          </div>

          {/* Right: flow mockup */}
          <div style={{
            background: 'var(--sage-50)', borderRadius: 'var(--radius)', padding: 28,
          }}>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              {channel.flow.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: msg.from === 'user' ? 'flex-end' : msg.from === 'system' ? 'center' : 'flex-start',
                  marginBottom: i < channel.flow.length - 1 ? 10 : 0,
                }}>
                  <div style={{
                    padding: msg.from === 'system' ? '8px 14px' : '10px 16px',
                    borderRadius: msg.from === 'system' ? 'var(--radius-sm)' : 14,
                    fontSize: 13, lineHeight: 1.5, maxWidth: msg.from === 'system' ? '100%' : '82%',
                    whiteSpace: 'pre-line',
                    background: msg.from === 'user'
                      ? 'var(--green-800)'
                      : msg.from === 'system'
                        ? msg.text.startsWith('✓') ? 'var(--sage-100)' : 'var(--gray-50)'
                        : msg.text.startsWith('✓') || msg.text.startsWith('→') ? 'var(--sage-100)' : 'var(--gray-50)',
                    color: msg.from === 'user'
                      ? '#fff'
                      : msg.text.startsWith('✓') ? 'var(--green-800)' : 'var(--gray-600)',
                    fontWeight: msg.text.startsWith('✓') ? 600 : 400,
                    ...(msg.from === 'system' && !msg.text.startsWith('✓') && !msg.text.startsWith('→') ? { border: '1px solid var(--gray-200)', fontSize: 12 } : {}),
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: '01', t: 'They reach out', d: 'Chat, phone, text, form, fax — whatever feels right to them. Carelu answers in under 3 seconds.' },
    { n: '02', t: 'We qualify', d: 'Insurance verified in real time. Eligibility confirmed. Red flags caught before they become problems.' },
    { n: '03', t: 'We collect', d: 'Insurance cards, diagnosis reports, consent forms — gathered in the conversation. No portals. No email chains.' },
    { n: '04', t: 'We follow up', d: "Something missing? Carelu texts, emails, and nudges — with the warmth of a person and the persistence of a machine." },
    { n: '05', t: 'You take over', d: 'Your clinical team gets a complete, organized, intake-ready case. They pick up where we left off.' },
  ];

  return (
    <section id="how-it-works" style={{ paddingTop: 'calc(var(--section-py) + 80px)', paddingBottom: 'var(--section-py)' }}>
      <div style={W}>
        <Pill>The process</Pill>
        <h2 className="rv-left" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.12, marginBottom: 72, maxWidth: 500 }}>
          From first contact to admitted patient.
        </h2>
        <div style={{ maxWidth: 860 }}>
          {steps.map((s, i) => (
            <div key={s.n}>
              <div className={`rv-left d${i + 1} step-row`} style={{ display: 'grid', gridTemplateColumns: '48px 180px 1fr', gap: 24, alignItems: 'baseline', padding: '30px 0' }}>
                <span className="step-num" style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)', fontWeight: 600 }}>{s.n}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--green-900)' }}>{s.t}</span>
                <span style={{ fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.65 }}>{s.d}</span>
              </div>
              {i < steps.length - 1 && <div className="step-divider" style={{ animationDelay: `${(i + 1) * 0.08}s` }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── IMPACT ───────────────────────────────────────
function Impact() {
  return (
    <section style={{ background: 'var(--sage-50)', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
      <div style={W}>
        <Pill>Proven Results</Pill>
        <h2 className="rv-scale" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: 'var(--green-900)', marginBottom: 64 }}>
          The results speak louder than we can.
        </h2>
        <LiveCounter />

        <div className="impact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { v: 3, s: '×', t: 'More families admitted', d: 'Same team. Same hours. Triple the output.' },
            { v: 10, s: ' min', t: 'First contact to intake-ready', p: '<', d: 'What used to take 3–5 days.' },
            { v: 85, s: '%', t: 'Family completion rate', d: 'Industry average is under 30%.' },
            { v: 0, s: '', t: 'Manual follow-ups', d: 'Your team focuses on care, not chasing.' },
          ].map((s, i) => (
            <div key={s.t} className={`rv-scale d${i + 1} card-lift`} style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '44px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--green-700)', lineHeight: 1, marginBottom: 12 }}>
                <Counter target={s.v} suffix={s.s} prefix={s.p || ''} />
              </div>
              <div style={{ fontWeight: 600, color: 'var(--black)', fontSize: 14, marginBottom: 6 }}>{s.t}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)', lineHeight: 1.5 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIAL ─────────────────────────────────
function Testimonial() {
  return (
    <section style={{ background: 'var(--sage-50)', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
      <div style={W}>
        <Pill>What providers say</Pill>

        <blockquote className="rv-left" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontStyle: 'italic',
          color: 'var(--green-900)',
          lineHeight: 1.2,
          maxWidth: 800,
          marginBottom: 40,
        }}>
          "We were losing 60% of families before they ever completed intake. Carelu brought that number under 15% in the first month."
        </blockquote>
        <div className="rv-left d2" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 80 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--sage-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: 'var(--green-800)' }}>MC</div>
          <div>
            <div style={{ fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--green-900)' }}>Maria C., Clinical Director</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>Bright Horizons ABA — 6 locations, Southeast US</div>
          </div>
        </div>

        {/* Supporting proof */}
        <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {[
            { stat: '60% → 15%', desc: 'Family drop-off rate, first month with Carelu' },
            { stat: '0 missed', desc: 'Every lead followed up — no one falls through the cracks' },
            { stat: '24 / 7', desc: 'Nights, weekends, holidays — never miss a family' },
          ].map((s, i) => (
            <div key={s.stat} className={`rv-scale d${i + 3} card-lift`} style={{ background: 'var(--sage-50)', borderRadius: 'var(--radius)', padding: '36px 28px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--green-800)', marginBottom: 8 }}>{s.stat}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── COMPLIANCE — formal certificate style ─────
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
          {/* Corner flourishes — subtle document feel */}
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

          {/* Certification grid — formal, structured */}
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
    { q: 'Will this replace our intake team?', a: "No — and that's the point. Carelu handles the repetitive parts (eligibility checks, document collection, follow-ups) so your team can spend their time on clinical work and complex cases." },
    { q: 'How long until we\'re live?', a: 'Most providers go live within 1–2 weeks. We handle setup, configure your insurance rules and conversation flows, and train your team.' },
    { q: 'What if a family needs a real person?', a: 'Carelu hands off to your team with full context — everything collected so far, the family\'s preferences, and a summary of the conversation.' },
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
              Still have questions? <a href="mailto:hello@carelu.ai" style={{ color: 'var(--green-700)', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}>We're real humans — just ask.</a>
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
              Let's make sure they find you — and that when they do, someone's there.
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
      <HubDiagram />
      <StickyTour />
      <Impact />
      <CustomerStories />
      <Compliance />
      <Faq />
      <CtaFooter />
    </>
  );
}
