import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import NavDropdown from '../components/NavDropdown';
import { segments } from '../data/segments';
import type { SegmentConfig } from '../data/segments';
import SiteFooter from '../components/SiteFooter';

/* ============================================================
   SEGMENT LANDING PAGE TEMPLATE
   One component renders all verticals. Content comes from
   the segments config. Design matches the main site.
   ============================================================ */

const W: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '0 36px' };

// The site footer's default headline is pediatric. Each vertical gets its own
// so the closing line matches who that page is actually for. Falls back to the
// default (undefined) for ABA.
const FOOTER_HEADLINES: Record<string, string | undefined> = {
  'aba-therapy': undefined,
  'mental-health': 'Somewhere right now, someone is looking for a therapist with room to see them.',
  'home-care': 'Somewhere right now, a family is trying to get someone home safely.',
  'addiction-treatment': 'Somewhere right now, someone has decided today is the day.',
  'hospice': 'Somewhere right now, a family is trying to make someone comfortable.',
};

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

function Nav(_props: { segment: SegmentConfig }) {
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--gray-200)' }}>
      <div style={{ ...W, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 96 }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 500, color: 'var(--green-900)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, letterSpacing: '-1.2px', lineHeight: 1 }}>
          <span className="dot-pulse" style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: 'var(--green-700)', display: 'inline-block', marginTop: 7 }} />
          carelu
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link to="/" className="hide-mobile nav-link" style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--gray-500)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--green-900)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray-500)'; }}
          >Home</Link>
          <span className="hide-mobile"><NavDropdown /></span>
          <a href="#results" className="hide-mobile nav-link" style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--gray-500)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--green-900)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray-500)'; }}
          >Results</a>
          <Link to="/demo" className="btn-primary" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#fff', backgroundColor: 'var(--green-800)', padding: '10px 24px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Request a Demo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── Cycling logo bar (same as homepage) ──
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
const SLOTS = 6;

function LogoBar() {
  const [slots, setSlots] = useState(() => Array.from({ length: SLOTS }, (_, i) => i));
  const [fadingSlot, setFadingSlot] = useState(-1);
  const poolRef = useRef(Array.from({ length: allLogos.length - SLOTS }, (_, i) => i + SLOTS));

  useEffect(() => {
    let currentSlot = 0;
    const timer = setInterval(() => {
      const slotToSwap = currentSlot % SLOTS;
      setFadingSlot(slotToSwap);
      setTimeout(() => {
        setSlots((prev) => {
          const next = [...prev];
          const pool = poolRef.current;
          if (pool.length === 0) return next;
          const newLogoIdx = pool.shift()!;
          pool.push(prev[slotToSwap]);
          next[slotToSwap] = newLogoIdx;
          return next;
        });
        setTimeout(() => setFadingSlot(-1), 50);
      }, 500);
      currentSlot++;
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: '40px 36px', borderBottom: '1px solid var(--gray-200)' }}>
      <p style={{ fontSize: 'var(--text-label)', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '2.5px', textAlign: 'center', marginBottom: 28 }}>
        Helping providers connect thousands of families to care — every day
      </p>
      <div className="logo-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 44, flexWrap: 'wrap' }}>
        {slots.map((logoIdx, i) => {
          const logo = allLogos[logoIdx];
          return (
            <div key={i} className={i >= 5 ? 'hide-mobile-logo' : ''} style={{ height: 40, width: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={logo.src} alt={logo.alt} style={{
                maxHeight: 40, maxWidth: 140, objectFit: 'contain',
                opacity: fadingSlot === i ? 0 : 0.7,
                transform: fadingSlot === i ? 'translateY(4px)' : 'translateY(0)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SegmentContent({ config }: { config: SegmentConfig }) {
  useReveal();
  useSeo({
    title: `Carelu for ${config.label} — AI Intake & Lead Response`,
    description: config.sub,
    canonical: `/for/${config.slug}`,
  });

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <Nav segment={config} />

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 132, paddingBottom: 60, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div className="orb-drift-1" style={{ position: 'absolute', width: 600, height: 600, top: -150, right: -100, borderRadius: '50%', background: 'radial-gradient(circle, var(--sage-100) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.7 }} />
          <div className="orb-drift-2" style={{ position: 'absolute', width: 400, height: 400, bottom: -50, left: -50, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,228,207,0.5) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>
        <div style={{ ...W, position: 'relative', zIndex: 1 }}>
          <Pill>{config.pill}</Pill>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-hero)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-2px', color: 'var(--green-900)', marginBottom: 28, maxWidth: 800 }}>
            {config.headline} <em style={{ fontStyle: 'italic' }}>{config.headlineAccent}</em>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--gray-600)', lineHeight: 1.75, maxWidth: 540, marginBottom: 44 }}>
            {config.sub}
          </p>
          <Link to="/demo" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 'var(--text-body)', fontWeight: 600, color: '#fff', backgroundColor: 'var(--green-800)', padding: '18px 36px', borderRadius: 'var(--radius-sm)', textDecoration: 'none' }}>
            Request a Demo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* Logo bar */}
      <LogoBar />

      {/* Pain Points */}
      <section style={{ backgroundColor: 'var(--green-900)', color: '#fff', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
        <div style={W}>
          <Pill dark>{config.painLabel}</Pill>
          <h2 className="rv" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, lineHeight: 1.12, color: '#fff', maxWidth: 640, marginBottom: 64 }}>
            {config.painHeadline}
          </h2>
          <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {config.pains.map((p, i) => (
              <div key={p.title} className={`rv d${i + 1}`} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius)', padding: '36px 32px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 600, color: '#fff', marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="solution" style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
        <div style={W}>
          <Pill>{config.solutionLabel}</Pill>
          <h2 className="rv-left" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.12, maxWidth: 600, marginBottom: 64 }}>
            {config.solutionHeadline}
          </h2>
          <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {config.solutions.map((s, i) => (
              <div key={s.title} className={`rv d${i + 1} card-lift`} style={{ background: 'var(--sage-50)', borderRadius: 'var(--radius)', padding: '40px 32px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', color: 'var(--green-900)', marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" style={{ background: 'var(--sage-50)', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
        <div style={W}>
          <Pill>Proven results</Pill>
          <h2 className="rv-scale" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: 'var(--green-900)', marginBottom: 64 }}>
            The results speak for themselves.
          </h2>
          <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 64 }}>
            {config.stats.map((s, i) => (
              <div key={s.label} className={`rv-scale d${i + 1}`} style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '44px 28px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, color: 'var(--green-800)', lineHeight: 1, marginBottom: 12 }}>{s.value}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', lineHeight: 1.5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="rv-left" style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '48px 40px' }}>
            <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 32px)', fontStyle: 'italic', color: 'var(--green-900)', lineHeight: 1.3, marginBottom: 28, maxWidth: 640 }}>
              "{config.testimonial.quote}"
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--sage-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'var(--green-800)' }}>{config.testimonial.initials}</div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--green-900)' }}>{config.testimonial.name}, {config.testimonial.role}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>{config.testimonial.company}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance badges */}
      <section style={{ borderTop: '1px solid var(--gray-200)', padding: '40px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {['HIPAA Compliant', 'SOC 2 Type II', 'US-Based Infrastructure', 'Payer-Compliant'].map((badge) => (
            <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-700)" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.5px' }}>{badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 36px 36px' }}>
        <div className="cta-grid mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, maxWidth: 1200, margin: '0 auto' }}>
          <div className="rv" style={{ background: 'var(--sage-100)', borderRadius: 'var(--radius)', padding: 'clamp(48px, 6vw, 72px)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.12, marginBottom: 20 }}>
              {config.ctaHeadline}
            </h2>
            <p style={{ fontSize: 'var(--text-body)', color: 'var(--gray-500)', lineHeight: 1.7, maxWidth: 460 }}>
              {config.ctaSub}
            </p>
          </div>
          <Link to="/demo" style={{
            background: 'var(--green-800)', borderRadius: 'var(--radius)', padding: '44px 40px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            textDecoration: 'none', transition: 'background-color 0.3s', minHeight: 220,
            position: 'relative', overflow: 'hidden',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--green-700)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--green-800)'; }}
          >
            <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)', letterSpacing: '1px', textTransform: 'uppercase' }}>Live in 2 weeks · No engineering needed</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>Request a Demo</span>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <SiteFooter headline={FOOTER_HEADLINES[config.slug]} />
    </div>
  );
}

export default function SegmentPage() {
  const { slug } = useParams<{ slug: string }>();
  const config = segments[slug || ''];

  if (!config) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--green-900)', marginBottom: 16 }}>Page not found</h1>
          <Link to="/" style={{ color: 'var(--green-700)', fontWeight: 600 }}>Go back to home</Link>
        </div>
      </div>
    );
  }

  return <SegmentContent config={config} />;
}
