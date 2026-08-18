import { useEffect } from 'react';
import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';
import STATS from '../data/intake_gap_stats.json';
import SiteFooter from '../components/SiteFooter';

/* ================================================================
   CARELU RESEARCH — THE INTAKE GAP (Intake Data Report №1)
   Original research page. Every figure is computed from Carelu's
   own production fleet (aggregated + de-identified — no PHI).
   Re-harvested from prod July 19, 2026 — ABA-only cohort:
   120 ABA provider organizations · 185,054 family conversations ·
   29,021 captured intake leads · families in 48 states.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const HAIR = 'rgba(43,42,38,0.08)';
const GREEN = '#3f7a34';

const W: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };
const MEASURE: React.CSSProperties = { maxWidth: 780, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

type Finding = {
  stat: string;
  statSuffix?: string;
  title: string;
  body: string;
  n: string;
  bar?: number; // 0-100 fill for the visual bar
  compare?: { label: string; value: number; accent?: boolean }[];
};

const FINDINGS: Finding[] = [
  {
    stat: String(STATS.cohort.afterHoursPct),
    statSuffix: '%',
    title: 'of family conversations start outside business hours.',
    body: 'Nearly half of all first conversations begin on evenings, weekends, or before 8am — when most front desks are dark. These are the most motivated families in the funnel (they\'re researching after the kids are in bed), and for most practices they hit voicemail.',
    n: `n = ${STATS.cohort.conversations.toLocaleString('en-US')} conversations across ${STATS.cohort.providers} ABA providers, Mon–Fri 8am–6pm ET baseline`,
    bar: STATS.cohort.afterHoursPct,
  },
  {
    stat: '+35',
    statSuffix: '%',
    title: 'median same-store growth in family demand, year over year.',
    body: 'Demand for ABA services is compounding — the median provider in our same-store cohort saw inquiry volume grow 35% YoY. The bottleneck in this market isn\'t families finding you. It\'s what happens after they do.',
    n: 'n = 37-provider same-store cohort, 13 months of monthly counts',
    bar: 35,
  },
  {
    stat: '0',
    statSuffix: ' / 114',
    title: 'providers let a family book an appointment during first contact.',
    body: 'Not a single provider in the fleet offered calendar booking inside the first conversation. Every family who wants to move forward is asked to wait for a callback — and every wait is a chance to keep shopping. It\'s the single most striking gap in the dataset.',
    n: 'n = 114 active ABA provider configurations',
    bar: 2,
  },
  {
    stat: '40',
    statSuffix: '%',
    title: 'of captured "leads" are actually job seekers.',
    body: 'Four in ten people who reach out through provider websites aren\'t families seeking care — they\'re RBTs and behavior techs looking for work. Practices that don\'t triage this burn intake hours on the wrong queue (and quietly sit on a hiring channel they\'re not using).',
    n: 'n = 12,600 classified inquiries',
    bar: 40,
  },
  {
    stat: '46',
    statSuffix: '%',
    title: 'of families report Medicaid as their payer.',
    body: 'Nearly half of inbound demand is Medicaid — which means eligibility rules, state-specific requirements, and verification speed aren\'t edge cases. They\'re the median family. Practices staffed and scripted for commercial-only intake are misconfigured for half their funnel.',
    n: 'n = 17,500 inquiries with payer data',
    bar: 46,
  },
  {
    stat: '22',
    statSuffix: '%',
    title: 'of families reach out before they have a diagnosis.',
    body: 'More than a fifth of inquiries arrive pre-diagnosis. Most practices turn these families away with "come back when you have the report" — losing them permanently. The providers who guide them to diagnostic partners own the relationship when the diagnosis lands.',
    n: 'n = 29,021 captured family leads; diagnosis status disclosed in conversation',
    bar: 22,
  },
  {
    stat: '2',
    statSuffix: '%',
    title: 'of providers re-engage families who go quiet.',
    body: 'Only 2% of providers had any automated re-engagement running. Combined with the after-hours gap, the picture is stark: families are lost not to competitors\' brilliance but to silence. Meanwhile 71% of providers run an identical, default first message — word for word the same greeting as the practice down the street.',
    n: 'n = 112–114 active provider configurations',
    bar: 2,
    compare: [
      { label: 'Providers with re-engagement on', value: 2, accent: true },
      { label: 'Providers running the identical default greeting', value: 71 },
    ],
  },
  {
    stat: '7',
    statSuffix: '×',
    title: 'faster monthly growth for providers whose intake feeds their CRM.',
    body: 'Providers with intake wired into their CRM grew +6.5% per month versus +0.9% for those without — a 7× difference. Correlation isn\'t causation (organized practices do many things well), but the association between connected intake and growth is the strongest in the dataset.',
    n: 'n = 117 ABA providers, 13 months; observational — correlation, not causation',
    compare: [
      { label: 'CRM-connected intake', value: 65, accent: true },
      { label: 'Disconnected intake', value: 9 },
    ],
  },
];

// State distribution + per-state payer mix are read from a data file that a
// scheduled refresh (scripts/report-refresh) regenerates from prod — so these
// numbers can update without touching the page.
const STATES = STATS.stateDistribution;

function useReportJsonLd() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'report-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Report',
      name: 'The Intake Gap — Carelu Research Intake Data Report №1',
      url: 'https://carelu.com/research/the-intake-gap',
      datePublished: '2026-07-19',
      description:
        'Original research on ABA intake: 185,054 family conversations across 120 ABA provider organizations in 48 states, aggregated and de-identified. Key findings: 48% of conversations start after hours, 40% of leads are job seekers, 46% Medicaid payer mix, and 0 of 114 providers offer in-conversation booking.',
      author: { '@type': 'Organization', name: 'Carelu Research', url: 'https://carelu.com/' },
      publisher: { '@id': 'https://carelu.com/#organization' },
    });
    document.head.appendChild(script);
    return () => { document.getElementById('report-jsonld')?.remove(); };
  }, []);
}

function Bar({ value, accent }: { value: number; accent?: boolean }) {
  return (
    <div style={{ height: 10, borderRadius: 100, background: 'rgba(43,42,38,0.08)', overflow: 'hidden' }}>
      <div style={{
        width: `${Math.max(value, 1.5)}%`, height: '100%', borderRadius: 100,
        background: accent === false ? 'rgba(43,42,38,0.35)' : GREEN,
        transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
      }} />
    </div>
  );
}

export default function IntakeGapReport() {
  useReveal();
  useSeo({
    title: 'The Intake Gap — ABA Intake Data Report | Carelu Research',
    description:
      'Original research from 185,054 family conversations across 120 ABA providers in 48 states: 48% of conversations start after hours, 40% of leads are job seekers, 46% are Medicaid, and 0 of 114 providers offer in-conversation booking.',
    canonical: '/research/the-intake-gap',
  });
  useReportJsonLd();

  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />

      {/* Hero */}
      <section style={{ paddingTop: 'clamp(150px, 18vw, 210px)', paddingBottom: 'clamp(30px, 4vw, 48px)', textAlign: 'center' }}>
        <div style={W}>
          <div className="rv">
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: INK, background: '#fff',
              padding: '10px 20px', borderRadius: 100,
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
            }}>Carelu Research · Intake Data Report №1</span>
          </div>
          <h1 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 6.4vw, 88px)',
            fontWeight: 400, color: INK, lineHeight: 1.04,
            letterSpacing: '-0.025em', margin: '26px auto 0', maxWidth: 800,
          }}>
            The Intake Gap.
          </h1>
          <p className="rv d2" style={{
            fontSize: 'clamp(16px, 1.6vw, 19px)', color: 'rgba(43,42,38,0.7)',
            lineHeight: 1.65, maxWidth: 640, margin: '24px auto 0',
          }}>
            What 185,054 family conversations across 120 ABA providers reveal about where
            providers actually lose families — and how much growth is sitting inside the funnel they already have.
          </p>
        </div>
      </section>

      {/* Methodology strip */}
      <section style={{ paddingBottom: 'clamp(40px, 6vw, 70px)' }}>
        <div style={W}>
          <div className="rv" style={{
            background: '#fff', borderRadius: 20,
            padding: 'clamp(22px, 3vw, 32px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 'clamp(18px, 3vw, 34px)',
            textAlign: 'center',
          }}>
            {[
              { v: STATS.cohort.providers.toLocaleString('en-US'), l: 'ABA provider organizations' },
              { v: STATS.cohort.conversations.toLocaleString('en-US'), l: 'family conversations' },
              { v: STATS.cohort.leads.toLocaleString('en-US'), l: 'captured intake leads' },
              { v: String(STATS.cohort.states), l: 'states & DC represented' },
            ].map((m) => (
              <div key={m.l}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 40px)',
                  color: INK, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                }}>{m.v}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.55)', marginTop: 8, lineHeight: 1.4 }}>{m.l}</div>
              </div>
            ))}
          </div>
          <p className="rv" style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.5)', lineHeight: 1.6, margin: '14px auto 0', maxWidth: 760, textAlign: 'center' }}>
            All figures are computed from Carelu production data for ABA providers only (non-ABA verticals excluded), aggregated across providers and de-identified.
            No protected health information appears in this report; no individual family or provider is identifiable.
          </p>
        </div>
      </section>

      {/* Findings */}
      {FINDINGS.map((f, idx) => (
        <section key={f.title} style={{ padding: 'clamp(26px, 3.6vw, 44px) 0' }}>
          <div style={MEASURE}>
            <div className="rv" style={{
              display: 'flex', gap: 'clamp(20px, 3.5vw, 40px)', alignItems: 'flex-start', flexWrap: 'wrap',
              borderTop: idx === 0 ? 'none' : `1px solid ${HAIR}`,
              paddingTop: idx === 0 ? 0 : 'clamp(26px, 3.6vw, 44px)',
            }}>
              <div style={{ flex: '0 0 auto', minWidth: 168 }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 7vw, 88px)',
                  color: GREEN, lineHeight: 0.95, letterSpacing: '-0.03em',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {f.stat}<span style={{ fontSize: '0.5em' }}>{f.statSuffix}</span>
                </div>
              </div>
              <div style={{ flex: '1 1 340px' }}>
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(21px, 2.3vw, 28px)',
                  fontWeight: 400, color: INK, lineHeight: 1.25,
                  letterSpacing: '-0.012em', margin: '0 0 12px',
                }}>{f.title}</h2>
                <p style={{ fontSize: 15.5, color: 'rgba(43,42,38,0.7)', lineHeight: 1.7, margin: 0 }}>{f.body}</p>
                {f.bar !== undefined && !f.compare && (
                  <div style={{ marginTop: 16 }}><Bar value={f.bar} /></div>
                )}
                {f.compare && (
                  <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {f.compare.map((c) => (
                      <div key={c.label}>
                        <div style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.6)', marginBottom: 5 }}>{c.label}</div>
                        <Bar value={c.value} accent={c.accent} />
                      </div>
                    ))}
                  </div>
                )}
                <p style={{ fontSize: 11.5, color: 'rgba(43,42,38,0.42)', margin: '12px 0 0', letterSpacing: '0.01em' }}>{f.n}</p>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* State by state */}
      <section style={{ padding: 'clamp(40px, 6vw, 70px) 0 0' }}>
        <div style={MEASURE}>
          <div className="rv" style={{ borderTop: `1px solid ${HAIR}`, paddingTop: 'clamp(30px, 4vw, 48px)' }}>
            <div style={{ display: 'flex', gap: 'clamp(20px, 3.5vw, 40px)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: '0 0 auto', minWidth: 168 }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 7vw, 88px)',
                  color: GREEN, lineHeight: 0.95, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
                }}>48</div>
                <div style={{ fontSize: 13, color: 'rgba(43,42,38,0.55)', marginTop: 8 }}>states &amp; DC represented</div>
              </div>
              <div style={{ flex: '1 1 340px' }}>
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(21px, 2.3vw, 28px)',
                  fontWeight: 400, color: INK, lineHeight: 1.25, letterSpacing: '-0.012em', margin: '0 0 12px',
                }}>Demand comes from 48 states — and clusters hard.</h2>
                <p style={{ fontSize: 15.5, color: 'rgba(43,42,38,0.7)', lineHeight: 1.7, margin: '0 0 18px' }}>
                  Families reached out from 47 states plus Washington, DC, but demand concentrates: Georgia and North
                  Carolina alone account for 27% of it, and the top twelve states carry more than three
                  quarters. Wherever your state sits on this list, the pattern inside the funnel — after-hours
                  arrivals, unanswered first contacts, silent waitlists — looks the same.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {STATES.map((row) => (
                    <div key={row.st} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ flexShrink: 0, width: 118, fontSize: 12.5, fontWeight: 600, color: INK }}>{row.name}</span>
                      <div style={{ flex: 1 }}><Bar value={row.pct * (100 / 14)} /></div>
                      <span style={{ flexShrink: 0, width: 46, textAlign: 'right', fontSize: 12.5, color: 'rgba(43,42,38,0.6)', fontVariantNumeric: 'tabular-nums' }}>{row.pct}%</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 11.5, color: 'rgba(43,42,38,0.42)', margin: '12px 0 0' }}>
                  n = 25,518 captured family leads with state data · share of national demand · top 12 of 48 states & DC shown
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance by state */}
      <section style={{ padding: 'clamp(40px, 6vw, 70px) 0 0' }}>
        <div style={MEASURE}>
          <div className="rv" style={{ borderTop: `1px solid ${HAIR}`, paddingTop: 'clamp(30px, 4vw, 48px)' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.7vw, 33px)',
              fontWeight: 400, color: INK, lineHeight: 1.18, letterSpacing: '-0.015em', margin: '0 0 12px',
            }}>The payer mix is a different map in every state.</h2>
            <p style={{ fontSize: 15.5, color: 'rgba(43,42,38,0.7)', lineHeight: 1.7, margin: '0 0 8px' }}>
              Nationally, {STATS.insuranceNational[0]?.pct}% of families name Medicaid — but the plan a
              family actually carries is intensely local. Ohio runs on CareSource; Tennessee on TennCare
              and BlueCare; Georgia on Peach State, CareSource, and Amerigroup. An intake script tuned for
              one state's payers is misconfigured the moment you cross a border. Here's the leading payer
              mix families reported, in the twelve highest-demand states.
            </p>
            <p style={{ fontSize: 12, color: 'rgba(43,42,38,0.45)', margin: '0 0 22px' }}>
              Share of families naming each payer, per state · Medicaid plans (incl. managed-care orgs) shown in green ·
              n = {STATS.insuranceClassified.toLocaleString('en-US')} classified responses
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 14 }}>
              {Object.entries(STATS.insuranceByState).map(([state, data]) => (
                <div key={state} style={{
                  background: '#fff', borderRadius: 16, padding: '18px 20px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: INK, marginBottom: 12, letterSpacing: '-0.01em' }}>{state}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {data.top.map((p) => (
                      <div key={p.payer}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                          <span style={{ fontSize: 12, color: 'rgba(43,42,38,0.72)', lineHeight: 1.3 }}>{p.payer}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: p.medicaid ? GREEN : 'rgba(43,42,38,0.6)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{p.pct}%</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 100, background: 'rgba(43,42,38,0.07)', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.max(p.pct, 2)}%`, height: '100%', borderRadius: 100, background: p.medicaid ? GREEN : 'rgba(43,42,38,0.4)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The read */}
      <section style={{ padding: 'clamp(48px, 7vw, 90px) 0 0' }}>
        <div style={MEASURE}>
          <div className="rv" style={{
            background: '#fff', borderRadius: 22,
            border: '1px solid rgba(63,122,52,0.2)',
            padding: 'clamp(28px, 4vw, 44px)',
            boxShadow: '0 6px 28px rgba(46,90,38,0.08)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GREEN, marginBottom: 14 }}>
              What the data says
            </div>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(21px, 2.4vw, 29px)',
              color: INK, lineHeight: 1.35, letterSpacing: '-0.01em', margin: 0,
            }}>
              Demand is growing 35% a year, but the machinery to receive it hasn't been built:
              nearly half of families arrive when no one answers, none can book an appointment
              when they do get through, and almost no one follows up when they go quiet.
              The growth most providers are buying with marketing is already sitting,
              unanswered, inside their own funnel.
            </p>
          </div>

          {/* Cite block */}
          <div className="rv" style={{ marginTop: 22, padding: '18px 22px', borderLeft: `3px solid ${GREEN}`, background: 'rgba(63,122,52,0.05)', borderRadius: '0 12px 12px 0' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: INK, marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Cite this report</div>
            <p style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.7)', lineHeight: 1.6, margin: 0 }}>
              Carelu Research, <em>The Intake Gap: Intake Data Report №1</em> (July 2026).
              carelu.com/research/the-intake-gap. Data may be cited freely with attribution.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator cross-link */}
      <section style={{ padding: 'clamp(40px, 6vw, 70px) 0 0' }}>
        <div style={MEASURE}>
          <a href="/tools/intake-leak-calculator" className="rv" style={{
            display: 'flex', alignItems: 'center', gap: 'clamp(16px, 2.5vw, 26px)', flexWrap: 'wrap',
            background: INK, borderRadius: 20, padding: 'clamp(24px, 3.2vw, 34px)',
            textDecoration: 'none', boxShadow: '0 10px 36px rgba(0,0,0,0.18)',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2.2vw, 26px)', color: BONE, letterSpacing: '-0.01em', marginBottom: 6 }}>
                See what these numbers mean for your practice.
              </div>
              <p style={{ fontSize: 14, color: 'rgba(250,248,243,0.65)', lineHeight: 1.55, margin: 0 }}>
                The ROI Calculator shows the families — and the profit — 40% more intakes would add to your practice.
              </p>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 9, flexShrink: 0,
              fontSize: 14.5, fontWeight: 600, color: INK, background: BONE,
              padding: '13px 24px', borderRadius: 100,
            }}>
              Open the calculator
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </span>
          </a>
        </div>
      </section>

      {/* Closing CTA */}
      <section style={{ padding: 'clamp(64px, 9vw, 110px) 0 clamp(80px, 10vw, 130px)', textAlign: 'center' }}>
        <div style={W}>
          <p className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 44px)',
            fontWeight: 400, color: INK, lineHeight: 1.15,
            letterSpacing: '-0.02em', margin: '0 0 14px',
          }}>
            Close your intake gap.
          </p>
          <p className="rv d1" style={{
            fontSize: 'clamp(15px, 1.5vw, 17px)', color: 'rgba(43,42,38,0.65)',
            lineHeight: 1.65, maxWidth: 560, margin: '0 auto 30px',
          }}>
            Carelu answers every family instantly — nights, weekends, and lunch rushes — and runs
            intake end to end. It's the machinery this report says is missing.
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
    </div>
  );
}
