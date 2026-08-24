import { useState, useEffect, useRef, useCallback } from 'react';

/* ================================================================
   GET-A-DEMO OVERLAY
   ================================================================
   Gated booking flow: name + work email + practice size first, then
   an explicit submit (which captures the lead via /api/leads) unlocks
   the calendar. The calendar is the existing
   Calendly event (their real connected calendar), mounted inline
   with the visitor's details prefilled.

   Styled to the site's light brand system — bone surface, white
   cards, ink text, lime accents, serif heading. Calendly is mounted
   with hide_event_type_details so only the bare calendar shows
   (no "LeadTrap Demo / 45 min" card, no corner ribbon), inside a
   white brand card so it reads as part of the page.

   DemoModalHost: mount once per page. It intercepts every click on
   an <a href="/demo"> (capture phase, so it beats react-router) and
   opens the overlay instead of navigating. Middle-click / new-tab
   still reaches the /demo page, which renders the same DemoFlow.
   ================================================================ */

const CALENDLY_URL = 'https://calendly.com/d/cs28-9x7-qs3/leadtrap-demo';
const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const MUTED = '#8C8674';
const LIME = '#D4F25C';
const PURPLE = '#7C5CE0';
const SIZES = ['1-10', '11-25', '26-50', '51-100', '101-500', '500+'];

function loadCalendlyScript(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as unknown as { Calendly?: unknown }).Calendly) { resolve(); return; }
    const existing = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
    if (existing) { existing.addEventListener('load', () => resolve()); return; }
    const s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  fontSize: 15, fontFamily: 'var(--font-body)', color: INK,
  background: '#fff', border: '1px solid rgba(43,42,38,0.12)',
  borderRadius: 100, padding: '14px 22px', outline: 'none',
  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600,
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: MUTED, marginBottom: 10,
};

export function DemoFlow() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [size, setSize] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const nameOk = name.trim().length >= 2;
  const ready = nameOk && emailOk && !!size;

  const missing = !nameOk ? 'Enter your name above'
    : !emailOk ? 'Enter your work email above'
    : !size ? 'Pick a practice size above'
    : null;

  // Submit = the lead is captured (fire-and-forget, never blocks the calendar)
  // and the calendar unlocks. Most visitors who fill the form but never pick a
  // slot would otherwise vanish. Name and size ride along inside `source`
  // because /api/leads (and its Slack workflow) only know `email` and `source`.
  const submit = () => {
    if (!ready || submitted) return;
    setSubmitted(true);
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        source: `demo: ${name.trim()} (${size})`.slice(0, 80),
      }),
    }).catch(() => {});
  };

  // Mount the Calendly inline widget exactly once, on submit.
  useEffect(() => {
    if (!submitted || mounted.current || !calRef.current) return;
    mounted.current = true;
    const el = calRef.current;
    loadCalendlyScript().then(() => {
      const Calendly = (window as unknown as {
        Calendly: { initInlineWidget: (opts: object) => void };
      }).Calendly;
      el.innerHTML = '';
      Calendly.initInlineWidget({
        // hide_event_type_details strips the "LeadTrap Demo / 45 min" card and
        // the Calendly corner ribbon — only the bare calendar renders.
        url: `${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&text_color=1a1a1a&primary_color=1a1a1a&utm_content=${encodeURIComponent(`practice_size_${size}`)}`,
        parentElement: el,
        prefill: {
          name: name.trim(),
          email: email.trim(),
          customAnswers: { a1: `Practice size: ${size}` },
        },
      });
    });
  }, [submitted, name, email, size]);

  return (
    <div>
      {/* Form row */}
      <div className="demo-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 22 }}>
        <div>
          <label style={labelStyle} htmlFor="demo-name">Full name</label>
          <input id="demo-name" type="text" autoComplete="name" placeholder="Full name*" value={name}
            onChange={(e) => setName(e.target.value)} style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(43,42,38,0.4)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(43,42,38,0.12)'; }}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="demo-email">Work email</label>
          <input id="demo-email" type="email" autoComplete="email" placeholder="Work email*" value={email}
            onChange={(e) => setEmail(e.target.value)} style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(43,42,38,0.4)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(43,42,38,0.12)'; }}
          />
        </div>
      </div>

      {/* Practice size pills — lime when selected, like the step badges */}
      <div style={{ marginBottom: 26 }}>
        <span style={labelStyle}>Practice size</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {SIZES.map((s) => {
            const active = size === s;
            return (
              <button key={s} type="button" onClick={() => setSize(s)} aria-pressed={active} style={{
                fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-body)',
                color: INK,
                background: active ? LIME : '#fff',
                border: active ? `1px solid ${LIME}` : '1px solid rgba(43,42,38,0.15)',
                boxShadow: active ? '0 2px 12px rgba(180, 212, 60, 0.35)' : '0 2px 8px rgba(0,0,0,0.03)',
                borderRadius: 100, padding: '10px 20px', cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.15s',
              }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = 'rgba(43,42,38,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = 'rgba(43,42,38,0.15)'; } e.currentTarget.style.transform = 'translateY(0)'; }}
              >{s}</button>
            );
          })}
        </div>
      </div>

      {/* Calendar — a white brand card; Calendly (bare calendar) blends into it.
          Kept ≤600px wide so Calendly renders its compact layout, which fills
          the card edge-to-edge with no inner border or corner ribbon. */}
      <div style={{
        position: 'relative', borderRadius: 20, overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
        minHeight: 'min(560px, 62vh)',
        maxWidth: 600, margin: '0 auto',
      }}>
        {/* Calendly mounts here once ready */}
        <div ref={calRef} style={{
          width: '100%', height: 'min(560px, 62vh)',
          opacity: submitted ? 1 : 0, transition: 'opacity 0.5s ease',
        }} />

        {/* White patch over Calendly's corner ribbon (blank area in this layout) */}
        {submitted && (
          <div aria-hidden="true" style={{
            position: 'absolute', top: 0, right: 0, width: 90, height: 90,
            background: '#fff', pointerEvents: 'none',
          }} />
        )}

        {!submitted && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}>
            {/* Faux dimmed calendar grid */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 24,
              display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10,
              opacity: 0.6, pointerEvents: 'none', alignContent: 'start', paddingTop: 44,
            }}>
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} style={{
                  aspectRatio: '1.5', borderRadius: 10,
                  background: i % 9 === 4 ? 'rgba(212,242,92,0.35)' : 'rgba(43,42,38,0.045)',
                }} />
              ))}
            </div>
            {ready ? (
              <button type="button" onClick={submit} style={{
                position: 'relative', fontSize: 15, fontWeight: 600,
                fontFamily: 'var(--font-body)', color: '#fff',
                background: PURPLE, border: `1px solid ${PURPLE}`,
                boxShadow: '0 8px 28px rgba(124, 92, 224, 0.45)',
                padding: '14px 30px', borderRadius: 100, cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.2s, background 0.2s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(124, 92, 224, 0.55)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(124, 92, 224, 0.45)'; }}
              >
                See available times&nbsp;&rarr;
              </button>
            ) : (
              <span style={{
                position: 'relative', fontSize: 14, fontWeight: 600,
                color: INK, background: '#fff',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 8px 28px rgba(0,0,0,0.12)',
                padding: '12px 24px', borderRadius: 100,
              }}>
                {missing}
              </span>
            )}
          </div>
        )}
      </div>

      <p style={{ fontSize: 12.5, color: MUTED, margin: '16px 0 0' }}>
        By booking, you agree to our <a href="#" style={{ color: INK, textDecoration: 'underline', textUnderlineOffset: 3 }}>Privacy Policy</a>.
      </p>
    </div>
  );
}

export default function DemoModalHost() {
  const [open, setOpen] = useState(false);

  // Intercept every /demo link on the page (capture phase beats react-router).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href === '/demo') {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Esc closes; body scroll locks while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  if (!open) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      role="dialog" aria-modal="true" aria-label="Get a demo"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(43, 42, 38, 0.4)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(8px, 2vw, 32px)',
        animation: 'demoFadeIn 0.25s ease both',
      }}
    >
      <div className="demo-modal-panel" style={{
        position: 'relative', width: '100%', maxWidth: 720,
        maxHeight: '94vh', overflowY: 'auto',
        background: BONE, borderRadius: 24,
        padding: 'clamp(22px, 3.5vw, 40px)',
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 40px 120px rgba(20, 20, 18, 0.35)',
        animation: 'demoPanelIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.6vw, 34px)',
            fontWeight: 400, color: INK, letterSpacing: '-0.01em', margin: 0,
          }}>
            Get a Demo
          </h2>
          <button onClick={close} aria-label="Close" style={{
            background: '#fff', border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            cursor: 'pointer', padding: 10,
            display: 'flex', borderRadius: 100, transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <DemoFlow />
      </div>

      <style>{`
        @keyframes demoFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes demoPanelIn { from { opacity: 0; transform: translateY(18px) scale(0.985); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .demo-modal-panel input::placeholder { color: rgba(43,42,38,0.35); }
        @media (max-width: 768px) {
          .demo-form-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
        }
      `}</style>
    </div>
  );
}
