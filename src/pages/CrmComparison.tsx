import { useEffect } from 'react';
import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';

/* ================================================================
   CARELU — CRM COMPARISON (/carelu-vs-crm)
   The category argument: a CRM is software your team OPERATES; Carelu
   is a care enablement platform that DOES the intake work itself.
   Ends on the partner note — Carelu also works inside your existing
   CRM (Salesforce, HubSpot, Zoho, Monday, ClickUp) so you never leave
   it, or can be your system of record. Standalone (not config-driven).
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const HAIR = 'rgba(43,42,38,0.08)';
const GREEN = '#3f7a34';

const W: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };
const MEASURE: React.CSSProperties = { maxWidth: 780, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

const CRMS = ['Salesforce', 'HubSpot', 'Zoho', 'Monday', 'ClickUp'];

const ROWS: { job: string; crm: string; carelu: string }[] = [
  { job: 'Answer a family at 9pm on a Saturday', crm: 'Only if you built the automation — and it can\'t actually talk to them', carelu: 'Answers live, in seconds, on phone, chat, form, or text' },
  { job: 'Verify insurance benefits', crm: 'Your staff, by phone, one family at a time', carelu: 'Done automatically at first contact' },
  { job: 'Collect documents & consents', crm: 'You design the forms; you chase the family', carelu: 'Collected conversationally, chased automatically' },
  { job: 'Follow up with a family who went quiet', crm: 'Fires the reminder you configured — to your staff', carelu: 'Re-engages the family directly, on its own' },
  { job: 'Qualify and route a new inquiry', crm: 'Rules you build and maintain', carelu: 'Qualified and routed for you, every time' },
  { job: 'Keep the record complete and current', crm: 'Only as complete as what your team types in', carelu: 'Fills itself from every conversation' },
  { job: 'Who does the intake work', crm: 'Your team — the CRM just remembers it', carelu: 'Carelu — your team does the human calls' },
];

export default function CrmComparison() {
  useReveal();
  useSeo({
    title: 'Carelu vs. a CRM: Care Enablement, Not Just Software You Run | Carelu',
    description:
      'A CRM (Salesforce, HubSpot, Zoho, Monday, ClickUp) is software your team has to operate. Carelu is a care enablement platform that does ABA intake for you — and integrates with your CRM so you never have to leave it.',
    canonical: '/carelu-vs-crm',
  });
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'crm-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Is Carelu a CRM?', acceptedAnswer: { '@type': 'Answer', text: 'No. A CRM is a database your team operates — it remembers your families and fires reminders, but your staff still does all the intake work. Carelu is a care enablement platform that does the intake itself: answering, qualifying, verifying insurance, and collecting documents, then handing you a complete record.' } },
        { '@type': 'Question', name: 'Can Carelu work with our existing CRM?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Carelu integrates with Salesforce, HubSpot, Zoho, Monday, ClickUp and others via native connections and webhooks. It does the intake work and syncs the complete record into your CRM — so you never have to leave the system your team already uses. Carelu can also serve as your system of record if you prefer.' } },
        { '@type': 'Question', name: 'Do we need a CRM if we have Carelu?', acceptedAnswer: { '@type': 'Answer', text: 'Not necessarily. Carelu can be your system of record for intake and families, or it can feed the CRM you already run. Either way, the intake work is done for you rather than by you.' } },
      ],
    });
    document.head.appendChild(script);
    return () => { document.getElementById('crm-jsonld')?.remove(); };
  }, []);

  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />

      {/* Hero */}
      <section style={{ paddingTop: 'clamp(150px, 18vw, 210px)', paddingBottom: 'clamp(28px, 4vw, 46px)', textAlign: 'center' }}>
        <div style={W}>
          <div className="rv">
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: INK, background: '#fff', padding: '10px 20px', borderRadius: 100,
              border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
            }}>Carelu vs. a CRM</span>
          </div>
          <h1 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 5vw, 68px)', fontWeight: 400,
            color: INK, lineHeight: 1.06, letterSpacing: '-0.022em', margin: '26px auto 0', maxWidth: 860,
          }}>
            A CRM is software you run.<br />Carelu does the work.
          </h1>
          <p className="rv d2" style={{
            fontSize: 'clamp(16px, 1.6vw, 19px)', color: 'rgba(43,42,38,0.7)',
            lineHeight: 1.65, maxWidth: 640, margin: '24px auto 0',
          }}>
            Salesforce, HubSpot, Zoho, Monday, ClickUp — they’re powerful, and they all have the same
            catch: someone on your team still has to operate them. Carelu is a care enablement platform.
            It doesn’t remind you to do intake — it does the intake.
          </p>
        </div>
      </section>

      {/* The core distinction */}
      <section style={{ padding: 'clamp(16px, 2.5vw, 30px) 0' }}>
        <div style={W}>
          <div className="crm-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div className="rv" style={{ background: '#fff', borderRadius: 20, padding: 'clamp(26px, 3.2vw, 38px)', boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)', marginBottom: 14 }}>
                A CRM
              </div>
              <p style={{ fontSize: 16, color: 'rgba(43,42,38,0.74)', lineHeight: 1.7, margin: '0 0 14px' }}>
                A filing cabinet with reminders. It stores your families, tracks stages, and pings your
                staff to act. Everything it "does" is work you first have to configure — then your team
                executes it, family by family, during business hours.
              </p>
              <p style={{ fontSize: 15, color: 'rgba(43,42,38,0.6)', lineHeight: 1.65, margin: 0 }}>
                You buy software. You staff it. You maintain it. The intake still depends on a person
                being available and on top of it.
              </p>
            </div>
            <div className="rv d1" style={{ background: INK, borderRadius: 20, padding: 'clamp(26px, 3.2vw, 38px)', boxShadow: '0 14px 44px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4F25C', marginBottom: 14 }}>
                Carelu — a care enablement platform
              </div>
              <p style={{ fontSize: 16, color: 'rgba(250,248,243,0.9)', lineHeight: 1.7, margin: '0 0 14px' }}>
                Not a place to track intake — the thing that performs it. Carelu answers every family
                the moment they reach out, qualifies them, verifies insurance, collects documents, and
                follows up, around the clock, without anyone driving it.
              </p>
              <p style={{ fontSize: 15, color: 'rgba(250,248,243,0.65)', lineHeight: 1.65, margin: 0 }}>
                You don’t operate Carelu. Carelu operates your front office — and your team is freed for
                the calls and the trust only people can build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ paddingTop: 'clamp(32px, 4.5vw, 56px)' }}>
        <div style={W}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.7vw, 33px)', fontWeight: 400,
            color: INK, lineHeight: 1.18, letterSpacing: '-0.015em', margin: '0 0 18px', textAlign: 'center',
          }}>Same job. Who actually does it?</h2>
          <div className="rv" style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${HAIR}` }}>
                    <th style={{ textAlign: 'left', padding: '16px 22px', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)', width: '32%' }}>The job</th>
                    <th style={{ textAlign: 'left', padding: '16px 22px', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)' }}>A CRM</th>
                    <th style={{ textAlign: 'left', padding: '16px 22px', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GREEN }}>Carelu</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r, i) => (
                    <tr key={r.job} style={{ borderBottom: i < ROWS.length - 1 ? `1px solid ${HAIR}` : 'none', background: i === ROWS.length - 1 ? 'rgba(63,122,52,0.04)' : 'transparent' }}>
                      <td style={{ padding: '14px 22px', fontSize: 14, fontWeight: 600, color: INK, lineHeight: 1.45 }}>{r.job}</td>
                      <td style={{ padding: '14px 22px', fontSize: 13.5, color: 'rgba(43,42,38,0.6)', lineHeight: 1.5 }}>{r.crm}</td>
                      <td style={{ padding: '14px 22px', fontSize: 13.5, color: '#2e5a26', fontWeight: 600, lineHeight: 1.5 }}>{r.carelu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* The turn: keep your CRM */}
      <section style={{ paddingTop: 'clamp(48px, 7vw, 84px)' }}>
        <div style={MEASURE}>
          <div className="rv" style={{
            background: '#fff', borderRadius: 22, border: '1px solid rgba(63,122,52,0.22)',
            padding: 'clamp(28px, 4vw, 44px)', boxShadow: '0 6px 28px rgba(46,90,38,0.08)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GREEN, marginBottom: 14 }}>
              Already love your CRM? Keep it.
            </div>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(21px, 2.4vw, 29px)',
              color: INK, lineHeight: 1.35, letterSpacing: '-0.01em', margin: '0 0 16px',
            }}>
              This isn’t rip-and-replace. Carelu works inside the CRM you already run.
            </p>
            <p style={{ fontSize: 15.5, color: 'rgba(43,42,38,0.72)', lineHeight: 1.72, margin: '0 0 14px' }}>
              Carelu connects natively to Salesforce, HubSpot, Zoho, Monday, and ClickUp — plus webhooks
              for anything else. It does all the intake work and syncs the complete, verified record
              straight into your CRM, so your team never has to leave the tool they know. Your pipeline,
              your reports, your dashboards — now filled by a platform that does the work instead of
              waiting for someone to.
            </p>
            <p style={{ fontSize: 15.5, color: 'rgba(43,42,38,0.72)', lineHeight: 1.72, margin: 0 }}>
              Don’t have a CRM you love? Carelu can be your system of record too. Either way, you stop
              managing intake software — and start admitting more families.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
              {CRMS.map((c) => (
                <span key={c} style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(43,42,38,0.7)', background: 'rgba(43,42,38,0.05)', padding: '6px 14px', borderRadius: 100 }}>{c}</span>
              ))}
              <span style={{ fontSize: 12.5, fontWeight: 600, color: GREEN, background: 'rgba(63,122,52,0.08)', padding: '6px 14px', borderRadius: 100 }}>+ webhooks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Individual CRM comparisons */}
      <section style={{ paddingTop: 'clamp(40px, 5.5vw, 64px)' }}>
        <div style={MEASURE}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(23px, 2.6vw, 31px)', fontWeight: 400,
            color: INK, lineHeight: 1.2, letterSpacing: '-0.015em', margin: '0 0 8px',
          }}>Compare Carelu to a specific CRM</h2>
          <p className="rv" style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.6)', margin: '0 0 16px', lineHeight: 1.6 }}>
            The same story, tool by tool — plus how Carelu works inside each one.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
            {[
              { slug: 'salesforce', name: 'Salesforce' },
              { slug: 'hubspot', name: 'HubSpot' },
              { slug: 'zoho', name: 'Zoho' },
              { slug: 'monday', name: 'monday.com' },
              { slug: 'clickup', name: 'ClickUp' },
            ].map((c) => (
              <a key={c.slug} href={`/carelu-vs-${c.slug}`} className="rv" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                background: '#fff', borderRadius: 14, padding: '16px 20px', textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s, box-shadow 0.25s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)'; }}
              >
                <span style={{ fontSize: 14.5, fontWeight: 600, color: INK }}>Carelu vs. {c.name}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ paddingTop: 'clamp(40px, 5.5vw, 64px)' }}>
        <div style={MEASURE}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.7vw, 33px)', fontWeight: 400,
            color: INK, lineHeight: 1.18, letterSpacing: '-0.015em', margin: '0 0 18px',
          }}>Common questions</h2>
          {[
            { q: 'Is Carelu a CRM?', a: 'No. A CRM is a database your team operates — it remembers your families and fires reminders, but your staff still does all the intake work. Carelu is a care enablement platform that does the intake itself: answering, qualifying, verifying insurance, and collecting documents, then handing you a complete record.' },
            { q: 'Can Carelu work with our existing CRM?', a: 'Yes — Carelu integrates with Salesforce, HubSpot, Zoho, Monday, ClickUp and others via native connections and webhooks. It does the intake work and syncs the complete record into your CRM, so you never have to leave the system your team already uses.' },
            { q: 'Do we still need a CRM if we have Carelu?', a: 'Not necessarily. Carelu can be your system of record for intake and families, or it can feed the CRM you already run. Either way, the intake work is done for you rather than by you.' },
          ].map((f) => (
            <div key={f.q} className="rv" style={{ borderTop: `1px solid ${HAIR}`, padding: '16px 0' }}>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: INK, margin: '0 0 7px', fontFamily: 'var(--font-body)' }}>{f.q}</h3>
              <p style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.68)', lineHeight: 1.68, margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0 clamp(80px, 10vw, 130px)', textAlign: 'center' }}>
        <div style={W}>
          <p className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.4vw, 42px)', fontWeight: 400,
            color: INK, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 14px',
          }}>
            Stop running software. Start admitting families.
          </p>
          <p className="rv d1" style={{
            fontSize: 'clamp(15px, 1.5vw, 17px)', color: 'rgba(43,42,38,0.65)',
            lineHeight: 1.65, maxWidth: 540, margin: '0 auto 30px',
          }}>
            See Carelu run a full intake end to end — and drop the finished record into your CRM.
          </p>
          <a href="/demo" className="rv d2" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontSize: 15, fontWeight: 600, color: BONE, backgroundColor: INK,
            padding: '16px 32px', borderRadius: 100, textDecoration: 'none',
            boxShadow: '0 8px 28px rgba(0,0,0,0.18)', transition: 'transform 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Get a Demo
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </section>

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
        @media (max-width: 820px) { .crm-two { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
