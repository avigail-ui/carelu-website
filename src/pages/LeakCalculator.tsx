import { useEffect, useState } from 'react';
import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';

/* ================================================================
   CARELU — INTAKE LEAK CALCULATOR (/tools/intake-leak-calculator)
   Enter monthly inquiries + monthly starts + revenue per client →
   see families lost per year and the annualized revenue gap vs a
   well-run funnel. Benchmarks from The Intake Gap report.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const HAIR = 'rgba(43,42,38,0.08)';
const GREEN = '#3f7a34';

const W: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

const fmtMoney = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${Math.round(n).toLocaleString('en-US')}`;

function Slider({ label, hint, value, min, max, step, format, onChange }: {
  label: string; hint: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: INK }}>{label}</label>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 24, color: INK,
          fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
        }}>{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="leak-slider"
        style={{ width: '100%' }}
      />
      <div style={{ fontSize: 12, color: 'rgba(43,42,38,0.5)', marginTop: 4, lineHeight: 1.45 }}>{hint}</div>
    </div>
  );
}

export default function LeakCalculator() {
  useReveal();
  useSeo({
    title: 'Intake Leak Calculator — How Many Families Is Your Intake Losing? | Carelu',
    description:
      'Free calculator for ABA and behavioral-health providers: enter your monthly inquiries and starts to see how many families — and how much revenue — your intake funnel loses each year.',
    canonical: '/tools/intake-leak-calculator',
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'calc-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Intake Leak Calculator',
      url: 'https://carelu.com/tools/intake-leak-calculator',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'Calculates how many families and how much revenue an ABA provider loses to intake drop-off each year.',
      publisher: { '@id': 'https://carelu.com/#organization' },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    });
    document.head.appendChild(script);
    return () => { document.getElementById('calc-jsonld')?.remove(); };
  }, []);

  const [inquiries, setInquiries] = useState(40);
  const [starts, setStarts] = useState(10);
  const [revenue, setRevenue] = useState(45000);
  const [recovery, setRecovery] = useState(30); // % of currently-lost families a faster funnel recovers

  const effStarts = Math.min(starts, inquiries);
  const conversion = inquiries > 0 ? effStarts / inquiries : 0;
  const lostPerMonth = Math.max(0, inquiries - effStarts);   // families not starting today
  const recoverablePerYear = lostPerMonth * (recovery / 100) * 12;
  const revenueRecovered = recoverablePerYear * revenue;
  const afterHours = Math.round(inquiries * 0.48);

  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />

      {/* Hero */}
      <section style={{ paddingTop: 'clamp(150px, 18vw, 200px)', paddingBottom: 'clamp(28px, 4vw, 44px)', textAlign: 'center' }}>
        <div style={W}>
          <div className="rv">
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: INK, background: '#fff',
              padding: '10px 20px', borderRadius: 100,
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
            }}>Free tool · Intake Leak Calculator</span>
          </div>
          <h1 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 68px)',
            fontWeight: 400, color: INK, lineHeight: 1.06,
            letterSpacing: '-0.022em', margin: '26px auto 0', maxWidth: 820,
          }}>
            How many families is your intake losing?
          </h1>
          <p className="rv d2" style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'rgba(43,42,38,0.68)',
            lineHeight: 1.65, maxWidth: 600, margin: '22px auto 0',
          }}>
            Three numbers you already know. One number you probably don't.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section style={{ paddingBottom: 'clamp(48px, 7vw, 80px)' }}>
        <div style={W}>
          <div className="calc-grid rv" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'stretch' }}>
            {/* Inputs */}
            <div style={{
              background: '#fff', borderRadius: 22,
              padding: 'clamp(26px, 3.4vw, 40px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
              display: 'flex', flexDirection: 'column', gap: 28, justifyContent: 'center',
            }}>
              <Slider
                label="Family inquiries per month"
                hint="Every call, form, chat, and text from a new family — the fleet median is 24/mo; the top decile sees 127."
                value={inquiries} min={5} max={300} step={5}
                format={(v) => String(v)}
                onChange={setInquiries}
              />
              <Slider
                label="Families who start services per month"
                hint="New clients who actually reach a first session."
                value={starts} min={0} max={150} step={1}
                format={(v) => String(v)}
                onChange={setStarts}
              />
              <Slider
                label="Annual revenue per client"
                hint="Typical ABA programs run tens of thousands per client per year — adjust to your payer mix."
                value={revenue} min={10000} max={120000} step={5000}
                format={(v) => fmtMoney(v)}
                onChange={setRevenue}
              />
              <Slider
                label="Share of lost families you could recover"
                hint="Not every family is winnable — some aren't eligible or choose another provider. This is the slice a faster, always-on intake realistically saves. We default to a conservative 30%."
                value={recovery} min={10} max={60} step={5}
                format={(v) => `${v}%`}
                onChange={setRecovery}
              />
            </div>

            {/* Results */}
            <div style={{
              background: INK, borderRadius: 22,
              padding: 'clamp(26px, 3.4vw, 40px)',
              boxShadow: '0 14px 44px rgba(0,0,0,0.22)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24,
            }}>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(250,248,243,0.5)', marginBottom: 8 }}>
                  Families not starting today
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 4vw, 52px)', color: BONE, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {Math.round(lostPerMonth * 12)}
                  </span>
                  <span style={{ fontSize: 13, color: 'rgba(250,248,243,0.55)' }}>inquiries a year that don’t become clients ({Math.round(conversion * 100)}% currently start)</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(250,248,243,0.5)', marginBottom: 6 }}>
                    Recoverable / year
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 3.2vw, 42px)', color: '#D4F25C', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {Math.round(recoverablePerYear)}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(250,248,243,0.45)', marginTop: 5, lineHeight: 1.4 }}>families, at {recovery}% recovery</div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(250,248,243,0.5)', marginBottom: 6 }}>
                    Revenue recovered
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 3.2vw, 42px)', color: '#D4F25C', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {fmtMoney(revenueRecovered)}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(250,248,243,0.45)', marginTop: 5, lineHeight: 1.4 }}>per year, annualized</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(250,248,243,0.12)', paddingTop: 18, fontSize: 13.5, color: 'rgba(250,248,243,0.68)', lineHeight: 1.6 }}>
                ~<strong style={{ color: BONE }}>{afterHours} of your {inquiries} monthly inquiries</strong> likely arrive
                outside business hours — 48% of all family inquiries do, and those are the most recoverable.{' '}
                <a href="/research/the-intake-gap" style={{ color: '#D4F25C', textDecoration: 'underline' }}>See the research →</a>
              </div>
            </div>
          </div>

          <p className="rv" style={{ fontSize: 12, color: 'rgba(43,42,38,0.45)', lineHeight: 1.6, margin: '14px auto 0', maxWidth: 720, textAlign: 'center' }}>
            Estimates, not guarantees — you control the recovery assumption above. Grounded in Carelu Research,
            {' '}<em>The Intake Gap</em> (2026) and the intake conversion ranges in our{' '}
            <a href="/resources/aba-intake-drop-off" style={{ color: 'rgba(43,42,38,0.6)' }}>drop-off guide</a>.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingBottom: 'clamp(80px, 10vw, 130px)', textAlign: 'center' }}>
        <div style={W}>
          <p className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.4vw, 40px)',
            fontWeight: 400, color: INK, lineHeight: 1.15,
            letterSpacing: '-0.02em', margin: '0 0 14px',
          }}>
            Now watch Carelu plug the leak.
          </p>
          <p className="rv d1" style={{
            fontSize: 'clamp(15px, 1.5vw, 17px)', color: 'rgba(43,42,38,0.65)',
            lineHeight: 1.65, maxWidth: 540, margin: '0 auto 30px',
          }}>
            Instant answers on every channel, day and night. Insurance verified up front.
            Every document chased automatically — so the families you can win, you win.
          </p>
          <a href="/demo" className="rv d2" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontSize: 15, fontWeight: 600, color: BONE, backgroundColor: INK,
            padding: '16px 32px', borderRadius: 100, textDecoration: 'none',
            boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Get a Demo
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </section>

      {/* Minimal footer */}
      <footer style={{ borderTop: `1px solid ${HAIR}`, padding: '28px 0' }}>
        <div style={{ ...W, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <a href="/carelu" style={{ textDecoration: 'none' }}>
            <img src="/carelu-logo.svg" alt="Carelu" style={{ height: 22, width: 'auto', display: 'block', opacity: 0.85 }} />
          </a>
          <span style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.5)' }}>
            © {new Date().getFullYear()} Carelu — The front office of care
          </span>
        </div>
      </footer>

      <style>{`
        @media (max-width: 860px) { .calc-grid { grid-template-columns: 1fr !important; } }
        .leak-slider { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 100px; background: rgba(43,42,38,0.12); outline: none; }
        .leak-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: ${GREEN}; cursor: pointer; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.25); }
        .leak-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: ${GREEN}; cursor: pointer; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.25); }
      `}</style>
    </div>
  );
}
