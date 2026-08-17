import { useEffect, useState } from 'react';
import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';
import SiteFooter from '../components/SiteFooter';

/* ================================================================
   CARELU — ROI CALCULATOR (/tools/intake-leak-calculator)
   Enter monthly intakes + what an intake is worth per year →
   see the extra families and annual profit Carelu adds at a
   33% intake uplift. Benchmarks from The Intake Gap report.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
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

export default function RoiCalculator() {
  useReveal();
  useSeo({
    title: 'ROI Calculator — What Are 33% More Intakes Worth? | Carelu',
    description:
      'Free ROI calculator for ABA and behavioral-health providers: enter your monthly intakes and what an intake is worth to see the families — and annual profit — Carelu adds.',
    canonical: '/tools/intake-leak-calculator',
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'calc-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'ROI Calculator',
      url: 'https://carelu.com/tools/intake-leak-calculator',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'Calculates the additional families and annual profit an ABA provider gains from a 33% increase in intakes with Carelu.',
      publisher: { '@id': 'https://carelu.com/#organization' },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    });
    document.head.appendChild(script);
    return () => { document.getElementById('calc-jsonld')?.remove(); };
  }, []);

  // Carelu's asserted intake uplift — a static figure we stand behind, not a
  // user guess. Grounded in the Intake Gap research: ~48% of inquiries arrive
  // after hours (largely unanswered) and the first provider to respond usually
  // wins, so always-on, complete intake grows starts by about a third.
  const UPLIFT = 0.33;

  const [intakes, setIntakes] = useState(100);
  const [value, setValue] = useState(15000);

  const addedFamilies = Math.round(intakes * UPLIFT);        // more families served each month
  const newIntakes = intakes + addedFamilies;                // monthly intakes with Carelu
  const addedProfit = addedFamilies * value;                 // added annual profit

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
            }}>Free tool · ROI Calculator</span>
          </div>
          <h1 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 68px)',
            fontWeight: 400, color: INK, lineHeight: 1.06,
            letterSpacing: '-0.022em', margin: '26px auto 0', maxWidth: 820,
          }}>
            What are 33% more intakes worth to you?
          </h1>
          <p className="rv d2" style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'rgba(43,42,38,0.68)',
            lineHeight: 1.65, maxWidth: 600, margin: '22px auto 0',
          }}>
            Two numbers you already know — and the profit Carelu adds.
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
                label="Intakes per month"
                hint="Families who start services each month — new clients reaching a first session."
                value={intakes} min={5} max={300} step={5}
                format={(v) => String(v)}
                onChange={setIntakes}
              />
              <Slider
                label="What an intake is worth per year"
                hint="Annual profit per client — adjust to your programs and payer mix."
                value={value} min={5000} max={60000} step={1000}
                format={(v) => fmtMoney(v)}
                onChange={setValue}
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
                  Added profit with Carelu
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 5vw, 64px)', color: '#D4F25C', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    +{fmtMoney(addedProfit)}
                  </span>
                  <span style={{ fontSize: 13, color: 'rgba(250,248,243,0.55)' }}>per year — same team, same marketing</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(250,248,243,0.5)', marginBottom: 6 }}>
                    Additional families
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 3.2vw, 42px)', color: BONE, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    +{addedFamilies}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(250,248,243,0.45)', marginTop: 5, lineHeight: 1.4 }}>served each month</div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(250,248,243,0.5)', marginBottom: 6 }}>
                    Monthly intakes
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 3.2vw, 42px)', color: BONE, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {newIntakes}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(250,248,243,0.45)', marginTop: 5, lineHeight: 1.4 }}>with Carelu, up from {intakes}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(250,248,243,0.12)', paddingTop: 18, fontSize: 13.5, color: 'rgba(250,248,243,0.68)', lineHeight: 1.6 }}>
                Carelu answers <strong style={{ color: BONE }}>100% of your inquiries instantly</strong> and runs intake to
                completion — 48% of inquiries arrive after hours, and the first provider to respond
                usually wins. That's how practices take in a third more families.{' '}
                <a href="/research/the-intake-gap" style={{ color: '#D4F25C', textDecoration: 'underline' }}>See the research →</a>
              </div>
            </div>
          </div>

          <p className="rv" style={{ fontSize: 12, color: 'rgba(43,42,38,0.45)', lineHeight: 1.6, margin: '14px auto 0', maxWidth: 720, textAlign: 'center' }}>
            Estimates, not guarantees — a modeled projection grounded in Carelu Research,
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
            Now watch Carelu make it real.
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
      <SiteFooter />

      <style>{`
        @media (max-width: 860px) { .calc-grid { grid-template-columns: 1fr !important; } }
        .leak-slider { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 100px; background: rgba(43,42,38,0.12); outline: none; }
        .leak-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: ${GREEN}; cursor: pointer; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.25); }
        .leak-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: ${GREEN}; cursor: pointer; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.25); }
      `}</style>
    </div>
  );
}
