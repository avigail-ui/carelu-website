import { useMemo, useState } from 'react';
import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';
import { PAYER_REVIEWED } from '../data/payers';
import POLICIES from '../data/payer_policies.json';

/* ================================================================
   CARELU — PAYER HUB (/payers)
   Searchable directory of every ABA payer guide + every individual
   policy requirement (sourced from primary payer/state documents).
   Search filters the visible list, but everything renders by default
   so the full text is crawlable. National vs. state guides, an
   expansion roadmap, and links to every primary source.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const HAIR = 'rgba(43,42,38,0.08)';
const GREEN = '#3f7a34';

const W: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

const NATIONAL = [
  { slug: 'aetna', name: 'Aetna', desc: 'CPB 0554 — ASD-only coverage, precert form GR-69017-4, telehealth codes.' },
  { slug: 'cigna', name: 'Cigna / Evernorth', desc: 'No PA on assessment codes; EN0499 treatment authorization; full telehealth.' },
  { slug: 'unitedhealthcare-optum', name: 'UnitedHealthcare / Optum', desc: 'Two-step auth via Provider Express, 4–6 month reviews, code clusters.' },
];
const STATES: { state: string; guides: { slug: string; name: string; desc: string }[] }[] = [
  {
    state: 'Georgia',
    guides: [
      { slug: 'georgia-medicaid', name: 'Georgia Medicaid (DCH)', desc: 'EPSDT coverage under 21, Katie Beckett path, CMO landscape, PA packages.' },
      { slug: 'anthem-bcbs-georgia', name: 'Anthem BCBS Georgia', desc: 'CG-BEH-02 criteria + Ava\'s Law and parity protections.' },
    ],
  },
];
const ROADMAP = ['North Carolina', 'New Jersey', 'Texas', 'Florida', 'TRICARE (Autism Care Demonstration)'];
const CATEGORIES = Array.from(new Set(POLICIES.policies.map((p) => p.category))).sort();

function GuideCard({ href, name, desc }: { href: string; name: string; desc: string }) {
  return (
    <a href={href} style={{
      display: 'block', background: '#fff', borderRadius: 18, padding: 'clamp(20px, 2.6vw, 26px)', textDecoration: 'none',
      boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)', transition: 'transform 0.2s, box-shadow 0.25s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.09)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 1.9vw, 22px)', fontWeight: 400, color: INK, margin: 0, letterSpacing: '-0.01em' }}>{name}</h3>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </div>
      <p style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.62)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </a>
  );
}

export default function PayersDirectory() {
  useReveal();
  useSeo({
    title: 'ABA Payer Directory: Coverage & Prior-Auth Policies by Insurer | Carelu',
    description:
      'Search every ABA payer policy in one place — Medicaid and commercial coverage, prior authorization, documentation, CPT codes, supervision, and telehealth rules by insurer and state, each linked to its primary source.',
    canonical: '/payers',
  });

  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('All');
  const query = q.trim().toLowerCase();

  const filtered = useMemo(() => {
    return POLICIES.policies.filter((p) => {
      if (cat !== 'All' && p.category !== cat) return false;
      if (!query) return true;
      const hay = `${p.payer} ${p.state} ${p.category} ${p.title} ${p.body}`.toLowerCase();
      return hay.includes(query);
    });
  }, [query, cat]);

  const byPayer = useMemo(() => {
    const m: Record<string, typeof POLICIES.policies> = {};
    for (const p of filtered) (m[p.payer] ||= []).push(p);
    return m;
  }, [filtered]);

  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />

      {/* Hero */}
      <section style={{ paddingTop: 'clamp(150px, 18vw, 200px)', paddingBottom: 'clamp(22px, 3vw, 36px)', textAlign: 'center' }}>
        <div style={W}>
          <div className="rv">
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: INK, background: '#fff', padding: '10px 20px', borderRadius: 100,
              border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
            }}>ABA Payer Directory</span>
          </div>
          <h1 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.8vw, 64px)', fontWeight: 400,
            color: INK, lineHeight: 1.08, letterSpacing: '-0.02em', margin: '26px auto 0', maxWidth: 840,
          }}>
            Every ABA payer policy, in one place.
          </h1>
          <p className="rv d2" style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'rgba(43,42,38,0.68)',
            lineHeight: 1.65, maxWidth: 640, margin: '20px auto 0',
          }}>
            Search {POLICIES.policies.length} coverage, prior-authorization, documentation, billing,
            supervision, and telehealth rules across {POLICIES.payers.length} payers — each linked to its
            primary source. Guides compiled from primary documents, last reviewed {PAYER_REVIEWED}.
          </p>
        </div>
      </section>

      {/* Search + category filter */}
      <section style={{ paddingBottom: 'clamp(24px, 3vw, 36px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' }}>
          <div className="rv" style={{ position: 'relative' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(43,42,38,0.4)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" /></svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search payers and policies — e.g. prior auth, telehealth, Aetna, CPT 97153…"
              aria-label="Search payer policies"
              style={{
                width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)', fontSize: 15,
                color: INK, background: '#fff', border: '1px solid rgba(43,42,38,0.14)', borderRadius: 100,
                padding: '15px 20px 15px 46px', outline: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = GREEN; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(43,42,38,0.14)'; }}
            />
          </div>
          <div className="rv" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14, justifyContent: 'center' }}>
            {['All', ...CATEGORIES].map((c) => (
              <button key={c} onClick={() => setCat(c)} style={{
                fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                padding: '7px 14px', borderRadius: 100, transition: 'all 0.15s ease',
                color: cat === c ? '#fff' : 'rgba(43,42,38,0.7)',
                background: cat === c ? GREEN : '#fff',
                border: `1px solid ${cat === c ? GREEN : 'rgba(43,42,38,0.14)'}`,
              }}>{c}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Guide cards */}
      <section style={{ paddingBottom: 'clamp(28px, 4vw, 44px)' }}>
        <div style={W}>
          <h2 className="rv" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(21px, 2.4vw, 28px)', fontWeight: 400, color: INK, letterSpacing: '-0.012em', margin: '0 0 4px' }}>Payer guides</h2>
          <p className="rv" style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.6)', margin: '0 0 16px' }}>Full intake-focused guides. National policies apply across states; state guides cover Medicaid and state-regulated plans.</p>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GREEN, margin: '4px 0 10px' }}>National commercial payers</div>
          <div className="dir-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
            {NATIONAL.map((g) => <GuideCard key={g.slug} href={`/payers/${g.slug}`} name={g.name} desc={g.desc} />)}
          </div>
          {STATES.map((st) => (
            <div key={st.state}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GREEN, margin: '4px 0 10px' }}>{st.state}</div>
              <div className="dir-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {st.guides.map((g) => <GuideCard key={g.slug} href={`/payers/${g.slug}`} name={g.name} desc={g.desc} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Policy database */}
      <section style={{ paddingBottom: 'clamp(40px, 6vw, 64px)' }}>
        <div style={W}>
          <h2 className="rv" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(21px, 2.4vw, 28px)', fontWeight: 400, color: INK, letterSpacing: '-0.012em', margin: '0 0 4px' }}>
            Policy database
          </h2>
          <p className="rv" style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.6)', margin: '0 0 18px' }}>
            {filtered.length === POLICIES.policies.length
              ? `All ${POLICIES.policies.length} policies`
              : `${filtered.length} of ${POLICIES.policies.length} policies`}
            {query ? ` matching “${q.trim()}”` : ''}{cat !== 'All' ? ` · ${cat}` : ''}.
          </p>

          {filtered.length === 0 && (
            <p style={{ fontSize: 15, color: 'rgba(43,42,38,0.6)', padding: '20px 0' }}>
              No policies match that search. Try a payer name, a topic like “prior authorization,” or a CPT code.
            </p>
          )}

          {Object.entries(byPayer).map(([payer, list]) => {
            const guide = list[0].guide;
            return (
              <div key={payer} className="rv" style={{ marginBottom: 26 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: INK, margin: 0, fontFamily: 'var(--font-body)' }}>
                    {payer} <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(43,42,38,0.45)' }}>· {list[0].state} · {list.length} {list.length === 1 ? 'policy' : 'policies'}</span>
                  </h3>
                  {guide && <a href={`/payers/${guide}`} style={{ fontSize: 12.5, fontWeight: 600, color: '#2e5a26', textDecoration: 'none', borderBottom: '1.5px solid rgba(63,122,52,0.4)', paddingBottom: 1 }}>Read the full guide →</a>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {list.map((p, i) => (
                    <div key={p.title + i} style={{ background: '#fff', borderRadius: 14, padding: 'clamp(16px, 2.2vw, 22px)', boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: GREEN, background: 'rgba(63,122,52,0.09)', padding: '3px 9px', borderRadius: 100 }}>{p.category}</span>
                        {p.effectiveDate && <span style={{ fontSize: 11.5, color: 'rgba(43,42,38,0.45)' }}>{p.effectiveDate}</span>}
                      </div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: INK, margin: '0 0 6px', fontFamily: 'var(--font-body)' }}>{p.title}</h4>
                      <p style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.68)', lineHeight: 1.6, margin: '0 0 8px' }}>{p.body}</p>
                      <a href={p.citationUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'rgba(43,42,38,0.55)', wordBreak: 'break-all' }}>Source ↗</a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Roadmap + checklist + disclaimer */}
      <section style={{ paddingBottom: 'clamp(40px, 6vw, 60px)' }}>
        <div style={W}>
          <div className="rv" style={{ background: 'rgba(63,122,52,0.05)', border: '1px dashed rgba(63,122,52,0.35)', borderRadius: 16, padding: 'clamp(18px, 2.4vw, 26px)', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: INK, marginBottom: 6 }}>More payers & states on the way</div>
            <p style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.65)', lineHeight: 1.6, margin: 0 }}>
              Next up: {ROADMAP.join(' · ')}. New guides are added on a rolling basis, and every published
              guide’s sources are automatically re-checked on a schedule. Need a payer covered sooner?{' '}
              <a href="/demo" style={{ color: '#2e5a26', fontWeight: 600 }}>Tell us which one</a>.
            </p>
          </div>
          <div className="rv" style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(63,122,52,0.22)', padding: 'clamp(18px, 2.4vw, 26px)', display: 'flex', alignItems: 'center', gap: 'clamp(14px, 2.5vw, 24px)', flexWrap: 'wrap', boxShadow: '0 6px 28px rgba(46,90,38,0.08)' }}>
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 3 }}>The verification-call checklist</div>
              <p style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.65)', lineHeight: 1.5, margin: 0 }}>Every question to ask on a benefits call — works for any payer, free to print.</p>
            </div>
            <a href="/downloads/aba-verification-call-checklist.pdf" download style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0, fontSize: 14, fontWeight: 600, color: '#fff', backgroundColor: GREEN, padding: '12px 22px', borderRadius: 100, textDecoration: 'none' }}>
              Download
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
            </a>
          </div>
          <p className="rv" style={{ fontSize: 12, color: 'rgba(43,42,38,0.5)', lineHeight: 1.6, margin: '16px 0 0', maxWidth: 820 }}>
            Payer policies change frequently and vary by plan, state, and funding type. This directory was
            compiled from primary sources and last reviewed {PAYER_REVIEWED}; it is general information, not
            billing, legal, or clinical advice. Always verify against the payer’s live policy and a benefits
            check for the specific member.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingBottom: 'clamp(80px, 10vw, 120px)', textAlign: 'center' }}>
        <div style={W}>
          <p className="rv" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3.2vw, 40px)', fontWeight: 400, color: INK, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 14px' }}>
            Or let Carelu handle the payers for you.
          </p>
          <p className="rv d1" style={{ fontSize: 'clamp(15px, 1.5vw, 17px)', color: 'rgba(43,42,38,0.65)', lineHeight: 1.65, maxWidth: 540, margin: '0 auto 30px' }}>
            Carelu captures every ID and document each payer requires and verifies benefits at first contact — automatically, for every family.
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

      <footer style={{ borderTop: `1px solid ${HAIR}`, padding: '28px 0' }}>
        <div style={{ ...W, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <a href="/carelu" style={{ textDecoration: 'none' }}>
            <img src="/carelu-logo.svg" alt="Carelu" style={{ height: 22, width: 'auto', display: 'block', opacity: 0.85 }} />
          </a>
          <span style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.5)' }}>© {new Date().getFullYear()} Carelu — The front office of care</span>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) { .dir-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 580px) { .dir-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
