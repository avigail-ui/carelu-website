import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { careluRevealed } from '../lib/careluReveal';

const accent = '#3a8ab0';

/* Outlined "Explore →" pill that inverts on hover. `external` renders a plain
   <a> (used for the Carelu card, which points at the product site carelu.com). */
function Pill({ to, label, light, external }: { to: string; label: string; light: boolean; external?: boolean }) {
  const [h, setH] = useState(false);
  const base = light ? '#fff' : accent;
  const style = {
    flexShrink: 0, textDecoration: 'none', whiteSpace: 'nowrap',
    display: 'inline-flex', alignItems: 'center', gap: 8,
    fontSize: 14, fontWeight: 600,
    padding: '11px 20px', borderRadius: 100,
    border: `1px solid ${h ? base : (light ? 'rgba(255,255,255,0.55)' : 'rgba(58,138,176,0.55)')}`,
    background: h ? base : 'transparent',
    color: h ? (light ? '#1A2E1F' : '#0a0a0c') : (light ? '#fff' : '#cfe6f2'),
    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
  } as const;
  const inner = (
    <>
      {label}
      <span style={{ display: 'inline-block', transform: h ? 'translateX(4px)' : 'none', transition: 'transform 0.25s' }}>→</span>
    </>
  );
  const handlers = { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) };
  return external
    ? <a href={to} {...handlers} style={style}>{inner}</a>
    : <Link to={to} {...handlers} style={style}>{inner}</Link>;
}

/* ----- product mock: Carelu intake chat (light) ----- */
function CareluMock() {
  return (
    <div style={{
      width: 'min(380px, 86%)', margin: '0 auto', background: '#fff',
      borderRadius: '18px 18px 0 0', boxShadow: '0 -8px 60px rgba(26,46,31,0.28)',
      border: '1px solid rgba(26,46,31,0.08)', borderBottom: 'none', overflow: 'hidden',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 16px', borderBottom: '1px solid #EEF1EC' }}>
        <img src="/carelu-logo.svg" alt="Carelu" style={{ height: 18, width: 'auto', display: 'block' }} />
      </div>
      <div style={{ padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <Bubble who="bot" text="Hi! Welcome to Bright Horizons ABA — what's your child's name?" />
        <Bubble who="me" text="Lucas. He has an autism diagnosis." />
        <Bubble who="bot" text="Wonderful. I can check your insurance coverage right now." />
      </div>
    </div>
  );
}
function Bubble({ who, text }: { who: 'bot' | 'me'; text: string }) {
  const me = who === 'me';
  return (
    <div style={{
      alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '82%',
      padding: '9px 13px', borderRadius: 13, fontSize: 12.5, lineHeight: 1.5,
      background: me ? '#2C3E2D' : '#EEF3EA', color: me ? '#fff' : '#2C3E2D',
    }}>{text}</div>
  );
}

/* ----- product mock: LeadTrap pipeline (dark) ----- */
function SuiteMock() {
  const rows: [string, string, string, string][] = [
    ['Thompson family', 'Phone', 'New', accent],
    ['Garcia family', 'Web', 'Qualified', '#5E9462'],
    ['Lee family', 'Text', 'Completed', '#5E9462'],
    ['Okafor family', 'Fax', 'Qualified', '#5E9462'],
  ];
  return (
    <div style={{
      width: 'min(440px, 92%)', margin: '0 auto', background: '#121319',
      borderRadius: '16px 16px 0 0', boxShadow: '0 -8px 60px rgba(0,0,0,0.5)',
      border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none', overflow: 'hidden',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Intake pipeline</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Today</span>
      </div>
      <div>
        {rows.map(([name, ch, status, col], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', fontSize: 10, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{name[0]}</span>
              <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.9)' }}>{name}</span>
              <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>· {ch}</span>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: col, background: `${col}22`, padding: '3px 9px', borderRadius: 100 }}>{status}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 18, padding: '12px 16px', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
        <span><b style={{ color: '#fff' }}>128</b> captured</span>
        <span><b style={{ color: '#fff' }}>96</b> qualified</span>
        <span><b style={{ color: '#fff' }}>84</b> completed</span>
      </div>
    </div>
  );
}

/* ----- stealth placeholder shown in the product card until reveal day.
   Generic, text-free frosted panel — reveals nothing about the product. ----- */
function StealthMock() {
  const bar = (w: string, bg: string, align: 'flex-start' | 'flex-end') => (
    <div style={{ height: 34, width: w, borderRadius: 12, background: bg, alignSelf: align }} />
  );
  return (
    <div style={{
      width: 'min(380px, 86%)', margin: '0 auto', background: 'rgba(255,255,255,0.92)',
      borderRadius: '18px 18px 0 0', boxShadow: '0 -8px 60px rgba(26,46,31,0.28)',
      border: '1px solid rgba(26,46,31,0.08)', borderBottom: 'none', overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ filter: 'blur(7px)', opacity: 0.5, padding: '18px 16px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 14, width: '52%', borderRadius: 8, background: '#dfe4dc' }} />
        {bar('80%', '#EEF3EA', 'flex-start')}
        {bar('56%', '#2C3E2D', 'flex-end')}
        {bar('74%', '#EEF3EA', 'flex-start')}
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: '#1A2E1F', background: 'rgba(255,255,255,0.82)',
          padding: '9px 15px', borderRadius: 100, border: '1px solid rgba(26,46,31,0.12)',
        }}>Coming soon</span>
      </div>
    </div>
  );
}

export default function Gateway() {
  const revealed = careluRevealed();
  useSeo({
    title: 'LeadTrap — Agentic infrastructure for growth',
    description: revealed
      ? 'LeadTrap builds vertical AI front offices that capture, qualify, and complete every inquiry — for the industries that run on intake. Maker of Carelu, AI intake for ABA and behavioral health.'
      : 'LeadTrap builds vertical AI front offices that capture, qualify, and complete every inquiry — for the industries that run on intake.',
    canonical: 'https://leadtrap.com/',
  });
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c', color: '#fff', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 55% 40% at 50% 16%, rgba(58,138,176,0.10), transparent 70%)' }} />

      {/* Nav */}
      <nav style={{ position: 'relative', zIndex: 3, width: '100%', maxWidth: 1320, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.jpeg" alt="" style={{ height: 28, width: 28, borderRadius: 7 }} />
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 19, color: '#fff', letterSpacing: '-0.02em' }}>LeadTrap</span>
        </Link>
        <a href="/demo" style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0c', background: '#fff', padding: '10px 20px', borderRadius: 100, textDecoration: 'none' }}>Request demo</a>
      </nav>

      {/* Headline */}
      <header style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '34px 24px 30px' }}>
        <h1 style={{ opacity: 0, animation: 'heroIn 1s var(--ease-dramatic) forwards', fontFamily: 'var(--font-body)', fontSize: 'clamp(13px, 2.9vw, 42px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0, whiteSpace: 'nowrap' }}>
          LeadTrap is the agentic infrastructure company for growth.
        </h1>
        <p style={{ opacity: 0, animation: 'heroIn 0.9s var(--ease-dramatic) 0.15s forwards', marginTop: 16, fontSize: 'clamp(14px, 1.2vw, 16px)', color: 'rgba(255,255,255,0.5)', maxWidth: 560, marginInline: 'auto', lineHeight: 1.6 }}>
          Vertical AI that captures, qualifies, and completes every inquiry — for the industries that run on intake.
        </p>
      </header>

      {/* Two panels */}
      <main style={{ position: 'relative', zIndex: 2, flex: 1, width: '100%', maxWidth: 1320, margin: '0 auto', padding: '0 20px 24px', opacity: 0, animation: 'heroIn 0.9s var(--ease-dramatic) 0.3s forwards' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16, alignItems: 'stretch' }}>

          {/* The product (sky). Carelu is revealed on/after CARELU_REVEAL;
              until then this card is a stealth "Coming soon" — no product
              name, no link, obscured preview. */}
          <section style={{
            position: 'relative', overflow: 'hidden', borderRadius: 20, minHeight: 524,
            display: 'flex', flexDirection: 'column',
            backgroundImage: 'linear-gradient(180deg, rgba(26,46,31,0.52) 0%, rgba(26,46,31,0.12) 30%, rgba(255,255,255,0) 58%), url(/sky.jpg)',
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, padding: '32px 34px 0', position: 'relative', zIndex: 2 }}>
              <div style={{ maxWidth: 380 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>The product</span>
                {revealed ? (
                  <>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 400, color: '#fff', margin: '12px 0 0', lineHeight: 1 }}>Carelu</h2>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', marginTop: 11 }}>AI intake for ABA &amp; behavioral health</div>
                    <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginTop: 9 }}>
                      Captures, qualifies, and completes every family's intake across every channel — built to never miss a lead.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 34, fontWeight: 600, color: '#fff', margin: '12px 0 0', lineHeight: 1.05, letterSpacing: '-0.02em' }}>Coming soon</h2>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', marginTop: 11 }}>An AI front office for behavioral health</div>
                    <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginTop: 9 }}>
                      In stealth: the system that meets every family the moment they reach out, completes the intake, and makes sure not one slips through. Launching soon.
                    </p>
                  </>
                )}
              </div>
              {revealed && <Pill to="https://carelu.com" label="Explore Carelu" light external />}
            </div>
            <div style={{ marginTop: 'auto', paddingTop: 28 }}>
              {revealed ? <CareluMock /> : <StealthMock />}
            </div>
          </section>

          {/* LeadTrap Suite — the company (dark + teal) */}
          <section style={{
            position: 'relative', overflow: 'hidden', borderRadius: 20, minHeight: 524,
            display: 'flex', flexDirection: 'column', background: '#0c0c11',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 28% 14%, rgba(58,138,176,0.22), transparent 68%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, padding: '32px 34px 0', position: 'relative', zIndex: 2 }}>
              <div style={{ maxWidth: 380 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent }}>The company</span>
                <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 29, fontWeight: 700, color: '#fff', margin: '13px 0 0', lineHeight: 1.05, letterSpacing: '-0.02em' }}>LeadTrap Suite</h2>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', marginTop: 11 }}>Vertical AI front offices</div>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginTop: 9 }}>
                  {revealed
                    ? 'The company behind Carelu — building vertical AI for every industry that lives or dies on intake.'
                    : 'Building vertical AI for every industry that lives or dies on intake.'}
                </p>
              </div>
              <Pill to="/company" label="Explore LeadTrap Suite" light={false} />
            </div>
            <div style={{ marginTop: 'auto', paddingTop: 28, position: 'relative', zIndex: 2 }}>
              <SuiteMock />
            </div>
          </section>

        </div>
      </main>

      <footer style={{ position: 'relative', zIndex: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 18, padding: '24px', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
        <a href="/privacy" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Privacy</a>
        <a href="/terms" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Terms</a>
        <span>© {new Date().getFullYear()} LeadTrap</span>
      </footer>
    </div>
  );
}
