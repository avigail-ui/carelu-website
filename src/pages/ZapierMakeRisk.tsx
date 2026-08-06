import { useEffect } from 'react';
import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';
import FrontOfficeRisksSection from '../components/FrontOfficeRisksSection';
import SiteFooter from '../components/SiteFooter';

/* ================================================================
   CARELU — ZAPIER & MAKE HIPAA RISK (/zapier-make-hipaa-risk)
   Why routing PHI through Zapier / Make is a HIPAA problem (no BAA),
   the dangers, and the penalty exposure — plus the shared front-
   office risks section. Cited; general info, not legal advice.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const HAIR = 'rgba(43,42,38,0.08)';
const RED = '#b0432b';

const W: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };
const MEASURE: React.CSSProperties = { maxWidth: 800, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

const DANGERS = [
  { title: 'No BAA means you own the violation', body: 'HIPAA requires a signed Business Associate Agreement with any vendor that handles PHI on your behalf. Neither Zapier nor Make offers one for standard accounts. Sending PHI through a vendor with no BAA is a violation in itself — not just if data leaks. When PHI is processed by an uncontracted vendor, the covered entity owns 100% of it.' },
  { title: 'Your data passes through — and lingers on — their servers', body: 'These tools work by receiving your data, processing it, and passing it on. Make\'s execution logs, for example, retain the data each scenario processes for a period of time. Every step is a copy of PHI on infrastructure no BAA covers.' },
  { title: 'Security certifications are not the legal instrument HIPAA needs', body: 'Make holds SOC 2 and ISO 27001; those attest to security practices but are not a BAA. HIPAA specifically requires the agreement. Good security without a BAA still leaves you non-compliant for PHI.' },
  { title: 'Sub-processors multiply the exposure', body: 'Zapier connects thousands of apps and relies on sub-processors that themselves don\'t support HIPAA — a big reason Zapier states it can\'t become HIPAA compliant. Each connection is another uncovered handoff of PHI.' },
  { title: 'It becomes invisible shadow IT', body: 'A well-meaning coordinator wiring up "when a form comes in, send it to our spreadsheet and Slack" can route diagnoses and insurance IDs through three un-covered systems in an afternoon — with no one realizing PHI just left the building.' },
];

export default function ZapierMakeRisk() {
  useReveal();
  useSeo({
    title: 'Zapier & Make Are Not HIPAA Compliant: The Risks for ABA Intake | Carelu',
    description:
      'Zapier and Make (Integromat) do not sign a BAA and are not HIPAA compliant — routing PHI through them can put ABA providers in violation. The dangers, the penalties, and the front-office risks to know.',
    canonical: '/zapier-make-hipaa-risk',
  });
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'zm-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Is Zapier HIPAA compliant?', acceptedAnswer: { '@type': 'Answer', text: 'No. Zapier states that the use of PHI under HIPAA is not supported on its platform and that it cannot sign business associate agreements (BAAs). Routing PHI through Zapier can place a healthcare provider in violation of HIPAA.' } },
        { '@type': 'Question', name: 'Is Make (Integromat) HIPAA compliant?', acceptedAnswer: { '@type': 'Answer', text: 'No. Make does not offer a BAA for standard accounts and is not positioned as HIPAA compliant; its execution logs also retain processed data. SOC 2 and ISO 27001 certifications are not a substitute for the BAA HIPAA requires.' } },
        { '@type': 'Question', name: 'What are the penalties for a HIPAA violation?', acceptedAnswer: { '@type': 'Answer', text: 'HIPAA civil penalties are tiered by culpability and adjusted annually for inflation — ranging from roughly $140 per violation to a maximum around $2.1 million per violation category per year. Willful-neglect cases and criminal violations carry the highest exposure, including fines up to $250,000 and imprisonment.' } },
      ],
    });
    document.head.appendChild(script);
    return () => { document.getElementById('zm-jsonld')?.remove(); };
  }, []);

  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />

      {/* Hero */}
      <section style={{ paddingTop: 'clamp(150px, 18vw, 200px)', paddingBottom: 'clamp(24px, 3.5vw, 42px)', textAlign: 'center' }}>
        <div style={W}>
          <div className="rv">
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: RED, background: 'rgba(176,67,43,0.08)', padding: '10px 20px', borderRadius: 100,
              border: '1px solid rgba(176,67,43,0.2)',
            }}>Compliance Risk</span>
          </div>
          <h1 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4.6vw, 60px)', fontWeight: 400,
            color: INK, lineHeight: 1.08, letterSpacing: '-0.02em', margin: '26px auto 0', maxWidth: 860,
          }}>
            Zapier and Make aren’t HIPAA compliant. For ABA intake, that’s a problem.
          </h1>
          <p className="rv d2" style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'rgba(43,42,38,0.7)',
            lineHeight: 1.65, maxWidth: 640, margin: '22px auto 0',
          }}>
            DIY automation tools are how a lot of practices duct-tape their front office together. The trouble
            is that intake data is PHI — and both Zapier and Make say, in their own words, that they don’t
            support it.
          </p>
        </div>
      </section>

      {/* The two statements */}
      <section style={{ paddingBottom: 'clamp(20px, 3vw, 34px)' }}>
        <div style={W}>
          <div className="zm-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div className="rv" style={{ background: '#fff', borderRadius: 20, padding: 'clamp(24px, 3vw, 34px)', boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)', borderTop: `3px solid ${RED}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: INK, marginBottom: 12 }}>Zapier</div>
              <p style={{ fontSize: 15, color: 'rgba(43,42,38,0.78)', lineHeight: 1.7, margin: '0 0 12px', fontStyle: 'italic' }}>
                “The use of regulated healthcare and medical data including Protected Health Information (PHI)
                under HIPAA isn’t supported on Zapier. Zapier also can’t sign business associate agreements
                (BAAs)… for handling PHI.”
              </p>
              <p style={{ fontSize: 13, color: 'rgba(43,42,38,0.55)', margin: 0 }}>— Zapier, official HIPAA statement</p>
            </div>
            <div className="rv d1" style={{ background: '#fff', borderRadius: 20, padding: 'clamp(24px, 3vw, 34px)', boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)', borderTop: `3px solid ${RED}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: INK, marginBottom: 12 }}>Make (Integromat)</div>
              <p style={{ fontSize: 15, color: 'rgba(43,42,38,0.78)', lineHeight: 1.7, margin: '0 0 12px' }}>
                Make does not offer a Business Associate Agreement for standard accounts and is not positioned
                as HIPAA compliant. Its execution logs retain the data each scenario processes, and its SOC 2 /
                ISO 27001 certifications are not the BAA HIPAA requires.
              </p>
              <p style={{ fontSize: 13, color: 'rgba(43,42,38,0.55)', margin: 0 }}>— Per Make’s published terms &amp; community guidance</p>
            </div>
          </div>
          <p className="rv" style={{ fontSize: 12, color: 'rgba(43,42,38,0.45)', margin: '12px 0 0', textAlign: 'center' }}>
            Vendor positions as of publication — always confirm current terms directly with each vendor.
          </p>
        </div>
      </section>

      {/* Why it's dangerous */}
      <section style={{ paddingTop: 'clamp(28px, 4vw, 46px)' }}>
        <div style={MEASURE}>
          <h2 className="rv" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.9vw, 36px)', fontWeight: 400, color: INK, lineHeight: 1.15, letterSpacing: '-0.018em', margin: '0 0 20px' }}>
            Why running intake through them is dangerous
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DANGERS.map((d) => (
              <div key={d.title} className="rv" style={{ background: '#fff', borderRadius: 16, padding: 'clamp(18px, 2.4vw, 24px)', boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: INK, margin: '0 0 6px', fontFamily: 'var(--font-body)' }}>{d.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(43,42,38,0.7)', lineHeight: 1.65, margin: 0 }}>{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Penalties */}
      <section style={{ paddingTop: 'clamp(40px, 5.5vw, 64px)' }}>
        <div style={MEASURE}>
          <h2 className="rv" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.9vw, 36px)', fontWeight: 400, color: INK, lineHeight: 1.15, letterSpacing: '-0.018em', margin: '0 0 12px' }}>
            The penalties are not theoretical.
          </h2>
          <p className="rv" style={{ fontSize: 15.5, color: 'rgba(43,42,38,0.7)', lineHeight: 1.7, margin: '0 0 20px' }}>
            HIPAA civil penalties are enforced by the HHS Office for Civil Rights, tiered by culpability, and
            adjusted for inflation each year. State attorneys general can bring their own actions, and a breach
            triggers mandatory notification of patients, HHS, and — for larger breaches — the media.
          </p>
          <div className="rv" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${HAIR}` }}>
                    <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)' }}>Culpability tier</th>
                    <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)' }}>Per violation</th>
                    <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)' }}>Annual cap*</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['No knowledge', '~$140 – $71,000', '~$2.1M'],
                    ['Reasonable cause', '~$1,400 – $71,000', '~$2.1M'],
                    ['Willful neglect — corrected', '~$14,000 – $71,000', '~$2.1M'],
                    ['Willful neglect — not corrected', '~$71,000+', '~$2.1M'],
                  ].map((row, i) => (
                    <tr key={row[0]} style={{ borderBottom: i < 3 ? `1px solid ${HAIR}` : 'none' }}>
                      <td style={{ padding: '13px 20px', fontSize: 14, fontWeight: 600, color: INK }}>{row[0]}</td>
                      <td style={{ padding: '13px 20px', fontSize: 13.5, color: 'rgba(43,42,38,0.7)', fontVariantNumeric: 'tabular-nums' }}>{row[1]}</td>
                      <td style={{ padding: '13px 20px', fontSize: 13.5, color: 'rgba(43,42,38,0.7)', fontVariantNumeric: 'tabular-nums' }}>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="rv" style={{ fontSize: 12, color: 'rgba(43,42,38,0.5)', lineHeight: 1.6, margin: '12px 0 0' }}>
            *Figures are approximate and adjusted annually for inflation by HHS; the per-violation maximum and
            annual cap converge at the top tier. <strong>Criminal</strong> violations (knowingly obtaining or
            disclosing PHI) carry fines up to $250,000 and up to 10 years imprisonment. This is general
            information, not legal advice — consult qualified counsel and the current HHS penalty schedule.
          </p>
        </div>
      </section>

      {/* Front-office risks (shared section) */}
      <section style={{ paddingTop: 'clamp(48px, 7vw, 84px)' }}>
        <div style={MEASURE}>
          <FrontOfficeRisksSection />
        </div>
      </section>

      {/* Carelu difference */}
      <section style={{ paddingTop: 'clamp(44px, 6vw, 72px)' }}>
        <div style={MEASURE}>
          <div className="rv" style={{ background: INK, borderRadius: 22, padding: 'clamp(28px, 4vw, 44px)', boxShadow: '0 14px 44px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4F25C', marginBottom: 14 }}>The compliant alternative</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(21px, 2.4vw, 29px)', color: BONE, lineHeight: 1.35, letterSpacing: '-0.01em', margin: '0 0 16px' }}>
              Carelu does the intake work itself — inside a system built for PHI.
            </p>
            <p style={{ fontSize: 15.5, color: 'rgba(250,248,243,0.82)', lineHeight: 1.7, margin: 0 }}>
              Carelu is HIPAA compliant and SOC 2 Type II, and signs a BAA with every provider. Instead of
              stringing PHI across form builders, spreadsheets, and un-covered automation tools, Carelu answers
              families, verifies insurance, and collects documents in one compliant place — then syncs the
              finished record into the system you already run. No PHI passing through tools that were never
              meant to hold it.
            </p>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section style={{ paddingTop: 'clamp(28px, 4vw, 40px)' }}>
        <div style={MEASURE}>
          <div className="rv" style={{ padding: '18px 22px', borderLeft: '3px solid rgba(43,42,38,0.2)', background: 'rgba(43,42,38,0.03)', borderRadius: '0 12px 12px 0' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: INK, marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sources & further reading</div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              <li style={{ fontSize: 13, lineHeight: 1.55 }}><a href="https://zapier.com/blog/is-zapier-hipaa-compliant/" target="_blank" rel="noreferrer" style={{ color: 'rgba(43,42,38,0.75)' }}>Zapier — Is Zapier HIPAA compliant?</a></li>
              <li style={{ fontSize: 13, lineHeight: 1.55 }}><a href="https://www.hipaajournal.com/is-zapier-hipaa-compliant/" target="_blank" rel="noreferrer" style={{ color: 'rgba(43,42,38,0.75)' }}>HIPAA Journal — Is Zapier HIPAA Compliant?</a></li>
              <li style={{ fontSize: 13, lineHeight: 1.55 }}><a href="https://www.paubox.com/blog/integromat-hipaa-compliant" target="_blank" rel="noreferrer" style={{ color: 'rgba(43,42,38,0.75)' }}>Paubox — Is Make (Integromat) HIPAA compliant?</a></li>
              <li style={{ fontSize: 13, lineHeight: 1.55 }}><a href="https://www.hhs.gov/hipaa/for-professionals/compliance-enforcement/index.html" target="_blank" rel="noreferrer" style={{ color: 'rgba(43,42,38,0.75)' }}>HHS Office for Civil Rights — HIPAA Enforcement &amp; Penalties</a></li>
            </ul>
            <p style={{ fontSize: 12, color: 'rgba(43,42,38,0.55)', lineHeight: 1.6, margin: '12px 0 0' }}>
              General information, not legal advice. Vendor terms and penalty amounts change; verify current
              vendor policies and the HHS penalty schedule, and consult qualified counsel for your situation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0 clamp(80px, 10vw, 130px)', textAlign: 'center' }}>
        <div style={W}>
          <p className="rv" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.4vw, 42px)', fontWeight: 400, color: INK, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 14px' }}>
            Get PHI off the duct tape.
          </p>
          <p className="rv d1" style={{ fontSize: 'clamp(15px, 1.5vw, 17px)', color: 'rgba(43,42,38,0.65)', lineHeight: 1.65, maxWidth: 540, margin: '0 auto 30px' }}>
            See how Carelu runs a compliant intake end to end — and retires the spreadsheet-and-Zap stack behind your front office.
          </p>
          <a href="/demo" className="rv d2" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 600, color: BONE, backgroundColor: INK, padding: '16px 32px', borderRadius: 100, textDecoration: 'none', boxShadow: '0 8px 28px rgba(0,0,0,0.18)', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Get a Demo
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </section>

      <SiteFooter />

      <style>{`@media (max-width: 820px) { .zm-two { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
