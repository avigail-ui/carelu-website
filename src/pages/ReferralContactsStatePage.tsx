import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';
import { GateModal, useGatedDownload } from '../components/ReferralGate';
import STATS from '../data/referral_contacts_stats.json';
import SiteFooter from '../components/SiteFooter';

/* ================================================================
   CARELU — PER-STATE REFERRAL CONTACTS
   (/resources/pediatrician-referral-contacts/:state)
   The browsable, indexable half of the referral-contacts dataset:
   one page per state with the full contact table (emails/phones
   masked — the free CSV download carries the full record), role
   and geography insights, payer-guide cross-links, and Dataset +
   Breadcrumb + FAQ structured data.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const HAIR = 'rgba(43,42,38,0.08)';
const GREEN = '#3f7a34';

const W: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };
const MEASURE: React.CSSProperties = { maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

const HUB = '/resources/pediatrician-referral-contacts';

const REFRESHED = new Date(STATS.generated + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

interface StateRow {
  name: string; title: string; org: string; city: string;
  linkedin: string; email: string; phone: string; phoneType?: string; practiceEmail?: string;
}
interface StateData {
  name: string; slug: string; file: string;
  count: number; emails: number; phones: number;
  roles: { label: string; count: number }[];
  topCities: { name: string; count: number }[];
  topOrgs: { name: string; count: number }[];
  rows: StateRow[];
}

// Vite code-splits each state JSON into its own lazy chunk.
const STATE_LOADERS = import.meta.glob('../data/referral_contacts/*.json');

const cardShadow = '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)';

function buildFaq(d: StateData) {
  const top = d.topCities[0]?.name;
  return [
    {
      q: `How many pediatric referral contacts are in the ${d.name} list?`,
      a: `${d.count.toLocaleString()} professionals — including ${d.emails > 0 ? `${d.emails.toLocaleString()} with verified work emails and ` : ''}${d.phones.toLocaleString()} with a phone number. The largest concentration is around ${top ?? 'the state’s major metros'}.`,
    },
    {
      q: 'Are the phone numbers direct lines?',
      a: 'Both kinds, clearly labeled. Where our enrichment verified a direct or mobile number, the row is marked "Direct". For every other provider we include the practice\'s main line from the federal NPI registry, marked "Practice" — still the fastest route to the front desk that books their referrals.',
    },
    {
      q: `Is the ${d.name} contact list free?`,
      a: 'Yes. The full CSV — names, titles, organizations, locations, LinkedIn profiles, verified emails and direct phone numbers — is free to download. We ask for a work email so we can send refreshed versions, but you can skip that and download anyway.',
    },
    {
      q: 'Why are emails and phone numbers masked on this page?',
      a: 'The on-page table is for browsing coverage. The free CSV download contains every contact detail unmasked, ready to import into your CRM or outreach tool.',
    },
    {
      q: `Who should use the ${d.name} list?`,
      a: `ABA and pediatric-therapy providers building referral relationships in ${d.name}. Pediatricians are the professionals families ask first after a developmental concern — a short intro email plus a phone follow-up to the right contacts is the highest-ROI growth channel most practices never work systematically.`,
    },
  ];
}

function useStateJsonLd(d: StateData | null) {
  useEffect(() => {
    if (!d) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'refstate-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Dataset',
          name: `Pediatric Referral Contacts — ${d.name}`,
          description: `${d.count.toLocaleString()} pediatricians and child-development professionals in ${d.name} with verified emails, direct phone numbers and LinkedIn profiles. Free CSV download.`,
          url: `https://carelu.com${HUB}/${d.slug}`,
          isAccessibleForFree: true,
          dateModified: STATS.generated,
          creator: { '@type': 'Organization', name: 'Carelu', url: 'https://carelu.com/' },
          distribution: [{ '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `https://carelu.com${d.file}` }],
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Resources', item: 'https://carelu.com/carelu' },
            { '@type': 'ListItem', position: 2, name: 'Pediatric referral contacts', item: `https://carelu.com${HUB}` },
            { '@type': 'ListItem', position: 3, name: d.name, item: `https://carelu.com${HUB}/${d.slug}` },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: buildFaq(d).map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    });
    document.head.appendChild(script);
    return () => { document.getElementById('refstate-jsonld')?.remove(); };
  }, [d]);
}

function StatePage({ meta }: { meta: (typeof STATS.states)[number] }) {
  const [data, setData] = useState<StateData | null>(null);
  const { pendingFile, download, clear } = useGatedDownload();
  useReveal();

  useSeo({
    title: `${meta.name} Pediatrician Contact List — ${meta.count.toLocaleString()} Pediatric Referral Contacts (Free) | Carelu`,
    description: `Free ${meta.name} pediatric referral list: ${meta.count.toLocaleString()} pediatricians and child-development professionals with ${meta.emails.toLocaleString()} verified emails and ${meta.phones.toLocaleString()} direct phone numbers. Browse online or download the CSV.`,
    canonical: `${HUB}/${meta.slug}`,
  });
  useStateJsonLd(data);

  useEffect(() => {
    let live = true;
    const load = STATE_LOADERS[`../data/referral_contacts/${meta.slug}.json`];
    if (load) {
      load().then((m) => { if (live) setData((m as { default: StateData }).default); });
    }
    return () => { live = false; };
  }, [meta.slug]);

  const faq = data ? buildFaq(data) : [];
  const roleSummary = data
    ? data.roles.slice(0, 3).map((r) => `${r.count.toLocaleString()} ${r.label.toLowerCase()}`).join(', ')
    : '';

  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />
      {pendingFile && <GateModal pendingFile={pendingFile} onDone={clear} />}

      {/* Hero */}
      <section style={{ paddingTop: 'clamp(140px, 16vw, 190px)', paddingBottom: 'clamp(28px, 4vw, 48px)', textAlign: 'center' }}>
        <div style={W}>
          <nav aria-label="Breadcrumb" className="rv" style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.5)', marginBottom: 18 }}>
            <a href={HUB} style={{ color: 'rgba(43,42,38,0.55)', textDecoration: 'none' }}>Pediatric referral contacts</a>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: INK, fontWeight: 600 }}>{meta.name}</span>
          </nav>
          <div className="rv">
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: INK, background: '#fff',
              padding: '10px 20px', borderRadius: 100,
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
            }}>Free dataset · Refreshed {REFRESHED}</span>
          </div>
          <h1 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4.4vw, 58px)',
            fontWeight: 400, color: INK, lineHeight: 1.08,
            letterSpacing: '-0.022em', margin: '24px auto 0', maxWidth: 860,
          }}>
            {meta.name} pediatric referral contacts
          </h1>
          <p className="rv d2" style={{
            fontSize: 'clamp(16px, 1.6vw, 18px)', color: 'rgba(43,42,38,0.72)',
            lineHeight: 1.7, maxWidth: 680, margin: '20px auto 0',
          }}>
            {meta.count.toLocaleString()} pediatricians and child-development professionals across {meta.name} —{' '}
            {meta.emails > 0 && <>{meta.emails.toLocaleString()} verified emails and </>}
            {meta.phones.toLocaleString()} phone numbers
            (direct lines where our enrichment verified one, otherwise the practice&apos;s main line, and
            every row is labeled which is which). Browse the list below, or take it with you as a clean CSV.
          </p>
          <div className="rv d3" style={{ marginTop: 28 }}>
            <button
              onClick={() => download(meta.file)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontSize: 15, fontWeight: 600, color: '#fff', backgroundColor: GREEN,
                padding: '16px 32px', borderRadius: 100, border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 28px rgba(46,90,38,0.28)',
                transition: 'transform 0.2s', fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Download the {meta.name} CSV — free
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
            </button>
            <p style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.5)', margin: '12px 0 0' }}>
              Full unmasked emails and phone numbers are in the download. No email required.
            </p>
          </div>
        </div>
      </section>

      {/* Insights */}
      {data && (
        <section style={{ paddingBottom: 'clamp(20px, 3vw, 36px)' }}>
          <div style={W}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
              <div className="rv" style={{ background: '#fff', borderRadius: 16, padding: 'clamp(20px, 2.6vw, 26px)', boxShadow: cardShadow }}>
                <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)', margin: '0 0 12px', fontFamily: 'var(--font-body)' }}>Who&apos;s in the list</h2>
                {data.roles.map((r) => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '6px 0', fontSize: 14 }}>
                    <span style={{ color: 'rgba(43,42,38,0.75)' }}>{r.label}</span>
                    <span style={{ color: INK, fontWeight: 700 }}>{r.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="rv" style={{ background: '#fff', borderRadius: 16, padding: 'clamp(20px, 2.6vw, 26px)', boxShadow: cardShadow }}>
                <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)', margin: '0 0 12px', fontFamily: 'var(--font-body)' }}>Top areas</h2>
                {data.topCities.map((c) => (
                  <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '6px 0', fontSize: 14 }}>
                    <span style={{ color: 'rgba(43,42,38,0.75)' }}>{c.name}</span>
                    <span style={{ color: INK, fontWeight: 700 }}>{c.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="rv" style={{ background: '#fff', borderRadius: 16, padding: 'clamp(20px, 2.6vw, 26px)', boxShadow: cardShadow }}>
                <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)', margin: '0 0 12px', fontFamily: 'var(--font-body)' }}>Top organizations</h2>
                {data.topOrgs.map((o) => (
                  <div key={o.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '6px 0', fontSize: 14 }}>
                    <span style={{ color: 'rgba(43,42,38,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.name}</span>
                    <span style={{ color: INK, fontWeight: 700 }}>{o.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            {roleSummary && (
              <p className="rv" style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.6)', lineHeight: 1.7, margin: '18px auto 0', maxWidth: 760, textAlign: 'center' }}>
                The {meta.name} list spans {roleSummary} — the professionals a family talks to before they ever search
                for an ABA or pediatric-therapy provider.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Full table */}
      <section style={{ paddingTop: 'clamp(24px, 3.4vw, 40px)' }}>
        <div style={W}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.7vw, 33px)',
            fontWeight: 400, color: INK, lineHeight: 1.18,
            letterSpacing: '-0.015em', margin: '0 0 6px', textAlign: 'center',
          }}>Every contact in {meta.name}</h2>
          <p className="rv" style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.6)', textAlign: 'center', margin: '0 0 22px' }}>
            Emails and phone numbers are masked on the page — the free CSV carries the full record,
            with each phone labeled as a direct line or the practice&apos;s main number.
            {data && data.rows.length < data.count && (
              <> Showing the first {data.rows.length.toLocaleString()} of {data.count.toLocaleString()} contacts — the CSV has all of them.</>
            )}
          </p>
          <div className="rv" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto', maxHeight: 640, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${HAIR}`, position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
                    {['Name', 'Title', 'Organization', 'City', 'Email (personal or office)', 'Phone (direct or practice)', ''].map((h, i) => (
                      <th key={i} style={{ textAlign: 'left', padding: '14px 14px', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data?.rows ?? []).map((r, i) => (
                    <tr key={`${r.name}-${i}`} style={{ borderBottom: `1px solid ${HAIR}` }}>
                      <td style={{ padding: '11px 14px', fontSize: 13.5, fontWeight: 600, color: INK }}>{r.name}</td>
                      <td style={{ padding: '11px 14px', fontSize: 13, color: 'rgba(43,42,38,0.65)' }}>{r.title}</td>
                      <td style={{ padding: '11px 14px', fontSize: 13, color: 'rgba(43,42,38,0.65)' }}>{r.org}</td>
                      <td style={{ padding: '11px 14px', fontSize: 13, color: 'rgba(43,42,38,0.65)', whiteSpace: 'nowrap' }}>{r.city}</td>
                      <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>
                        {r.email ? (
                          <span style={{ fontSize: 12, color: 'rgba(43,42,38,0.6)', fontFamily: 'monospace' }}>{r.email}</span>
                        ) : r.practiceEmail ? (
                          <>
                            <span style={{ fontSize: 12, color: 'rgba(43,42,38,0.6)', fontFamily: 'monospace' }}>{r.practiceEmail}</span>
                            <span style={{
                              marginLeft: 7, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                              textTransform: 'uppercase', padding: '2px 7px', borderRadius: 100,
                              color: 'rgba(43,42,38,0.55)', background: 'rgba(43,42,38,0.06)',
                            }}>Office</span>
                          </>
                        ) : (
                          <span style={{ fontSize: 12, color: 'rgba(43,42,38,0.6)' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 12, color: 'rgba(43,42,38,0.6)', fontFamily: 'monospace' }}>{r.phone || '—'}</span>
                        {r.phone && r.phoneType && (
                          <span style={{
                            marginLeft: 7, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                            textTransform: 'uppercase', padding: '2px 7px', borderRadius: 100,
                            color: r.phoneType === 'Direct' ? '#2e5a26' : 'rgba(43,42,38,0.55)',
                            background: r.phoneType === 'Direct' ? 'rgba(63,122,52,0.10)' : 'rgba(43,42,38,0.06)',
                          }}>{r.phoneType}</span>
                        )}
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        {r.linkedin && (
                          <a href={r.linkedin} target="_blank" rel="nofollow noopener noreferrer" aria-label={`${r.name} on LinkedIn`}
                            style={{ color: 'rgba(43,42,38,0.45)', display: 'inline-flex' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" /></svg>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!data && (
                <p style={{ padding: 24, fontSize: 14, color: 'rgba(43,42,38,0.5)', textAlign: 'center' }}>Loading the {meta.name} list…</p>
              )}
            </div>
          </div>
          <div className="rv" style={{ textAlign: 'center', marginTop: 22 }}>
            <button
              onClick={() => download(meta.file)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                fontSize: 14.5, fontWeight: 600, color: GREEN,
                background: 'rgba(63,122,52,0.08)', border: 'none', cursor: 'pointer',
                padding: '13px 26px', borderRadius: 100, fontFamily: 'var(--font-body)',
              }}
            >
              Get all {meta.count.toLocaleString()} {meta.name} contacts unmasked (CSV)
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ paddingTop: 'clamp(40px, 5.5vw, 64px)' }}>
        <div style={MEASURE}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.7vw, 33px)',
            fontWeight: 400, color: INK, lineHeight: 1.18,
            letterSpacing: '-0.015em', margin: '0 0 18px',
          }}>Common questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faq.map((f) => (
              <div key={f.q} className="rv" style={{ borderTop: `1px solid ${HAIR}`, padding: '18px 0' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: INK, margin: '0 0 8px', fontFamily: 'var(--font-body)' }}>{f.q}</h3>
                <p style={{ fontSize: 15, color: 'rgba(43,42,38,0.68)', lineHeight: 1.7, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other states */}
      <section style={{ paddingTop: 'clamp(40px, 5.5vw, 64px)' }}>
        <div style={W}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.4vw, 29px)',
            fontWeight: 400, color: INK, lineHeight: 1.18,
            letterSpacing: '-0.015em', margin: '0 0 18px', textAlign: 'center',
          }}>Referral contacts in other states</h2>
          <div className="rv" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 860, margin: '0 auto' }}>
            {STATS.states.filter((s) => s.slug !== meta.slug).map((s) => (
              <a key={s.slug} href={`${HUB}/${s.slug}`} style={{
                fontSize: 13.5, fontWeight: 600, color: 'rgba(43,42,38,0.7)',
                background: '#fff', padding: '10px 18px', borderRadius: 100,
                textDecoration: 'none', boxShadow: cardShadow,
              }}>
                {s.name} <span style={{ color: 'rgba(43,42,38,0.4)', fontWeight: 500 }}>· {s.count}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section style={{ padding: 'clamp(56px, 8vw, 100px) 0 clamp(80px, 10vw, 130px)', textAlign: 'center' }}>
        <div style={W}>
          <p className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 44px)',
            fontWeight: 400, color: INK, lineHeight: 1.15,
            letterSpacing: '-0.02em', margin: '0 0 14px',
          }}>
            The referrals will come. Make sure they start.
          </p>
          <p className="rv d1" style={{
            fontSize: 'clamp(15px, 1.5vw, 17px)', color: 'rgba(43,42,38,0.65)',
            lineHeight: 1.65, maxWidth: 560, margin: '0 auto 30px',
          }}>
            Outreach fills the top of your funnel — Carelu makes sure every referred {meta.name} family gets an
            instant answer, verified benefits, and a scheduled assessment before they call anyone else.
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

export default function ReferralContactsStatePage() {
  const { state } = useParams<{ state: string }>();
  const meta = STATS.states.find((s) => s.slug === state);
  if (!meta) return <Navigate to={HUB} replace />;
  // key remounts on state change so per-state hooks (SEO, data) reset cleanly
  return <StatePage key={meta.slug} meta={meta} />;
}
