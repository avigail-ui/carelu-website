import { useEffect } from 'react';
import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';
import { GateModal, useGatedDownload } from '../components/ReferralGate';
import STATS from '../data/referral_contacts_stats.json';
import SiteFooter from '../components/SiteFooter';

/* ================================================================
   CARELU — PEDIATRIC REFERRAL CONTACTS (/resources/pediatrician-referral-contacts)
   Free gated dataset: 3,378 pediatricians + child-development
   professionals across 16 states, with verified emails, direct
   phones and LinkedIn. Soft email gate: the modal asks for a work
   email before a download but can be dismissed — the download
   proceeds either way (POST /api/leads records given emails).
   Brand system matches ResourcePage: bone surface, ink text,
   EB Garamond display, floating pill nav, minimal footer.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const HAIR = 'rgba(43,42,38,0.08)';
const GREEN = '#3f7a34';

const W: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };
const MEASURE: React.CSSProperties = { maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

const REFRESHED = new Date(STATS.generated + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const FAQ = [
  {
    q: 'Is the dataset really free?',
    a: 'Yes — every state file and the combined list are free to download and use. We ask for a work email so we can send you refreshed versions, but you can skip that and download anyway.',
  },
  {
    q: 'How current is the contact information?',
    a: `The list was last refreshed in ${REFRESHED}. The base roster comes from the federal NPI registry — the government's continuously updated record of every licensed provider — and the enrichment layer (emails, direct dials, websites, LinkedIn) is cross-checked through dozens of provider data sources, with records that stop verifying corrected or removed.`,
  },
  {
    q: 'Are the phone numbers direct lines?',
    a: 'Both kinds, clearly labeled in every download. Rows marked "Direct" carry a verified direct or mobile number from our enrichment. Rows marked "Practice" carry the practice\'s main line from the federal NPI registry — still the fastest route to the front desk that books their referrals.',
  },
  {
    q: 'Can I import it into my CRM or email tool?',
    a: 'Yes. Files are plain CSV with one consistent column layout (name, title, organization, location, website, LinkedIn, email, phone), so they map cleanly into HubSpot, Salesforce, Instantly, Smartlead, or any spreadsheet.',
  },
  {
    q: 'Is it legal to email these contacts?',
    a: 'Business-to-business outreach to professionals at their work contact information is legal in the U.S. under CAN-SPAM as long as you follow its rules: identify yourself and your organization truthfully, use an accurate subject line, include a physical mailing address, and honor opt-outs promptly. Keep outreach professional and relevant — these are clinicians, and your reputation with them is the asset.',
  },
  {
    q: 'Who is in the list?',
    a: 'The professionals families see before they find you: every pediatrician in the federal registry — general, developmental-behavioral, and pediatric subspecialists — plus pediatric nurse practitioners nationwide, and enriched records for child psychologists, psychiatrists, licensed clinical social workers and child therapists in select states.',
  },
];

/* Dataset + FAQPage JSON-LD, injected per page and cleaned up on unmount. */
function useDatasetJsonLd() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'refdir-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Dataset',
          name: 'Pediatric Referral Contacts — 16 U.S. States',
          description: `${STATS.total.toLocaleString()} pediatricians and child-development professionals across ${STATS.stateCount} states, with verified emails, direct phone numbers and LinkedIn profiles. Free CSV downloads per state.`,
          url: 'https://carelu.com/resources/pediatrician-referral-contacts',
          isAccessibleForFree: true,
          dateModified: STATS.generated,
          creator: { '@type': 'Organization', name: 'Carelu', url: 'https://carelu.com/' },
          distribution: [
            {
              '@type': 'DataDownload',
              encodingFormat: 'text/csv',
              contentUrl: `https://carelu.com${STATS.combinedFile}`,
            },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: FAQ.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    });
    document.head.appendChild(script);
    return () => { document.getElementById('refdir-jsonld')?.remove(); };
  }, []);
}

/* ---- Page ----------------------------------------------------------- */

const WHY_CARDS = [
  { title: 'Referred families convert', desc: 'A family sent by their pediatrician arrives pre-sold: they trust the recommendation, they usually arrive diagnosis-in-hand, and they call one provider — you — instead of five.' },
  { title: 'The channel compounds', desc: 'An ad stops working the day you stop paying. A pediatrician who trusts your intake experience sends you families for years — every relationship you build keeps paying.' },
  { title: 'Almost nobody does it well', desc: 'Most ABA practices rely on payer directories and word of mouth. A practice that shows up professionally in a pediatrician’s inbox has that inbox largely to itself.' },
];

const INSIDE_CARDS = [
  { title: 'Who they are', desc: 'Full name and exact job title — pediatrician, developmental-behavioral pediatrician, child psychologist, LCSW — so you can segment outreach by role.' },
  { title: 'Where they practice', desc: 'Organization, practice website, and location, so every email can reference the actual practice and city you’d be serving together.' },
  { title: 'How to reach them', desc: `${STATS.emails.toLocaleString()} verified work emails and ${STATS.phones.toLocaleString()} phone numbers — direct lines where our enrichment found one, otherwise the practice's main line, and every row is labeled which is which. ${STATS.linkedin.toLocaleString()} contacts also carry a LinkedIn profile.` },
];

const PLAYBOOK_CARDS = [
  { title: '1 · Segment by geography', desc: 'Filter each state file to the counties around your locations. A pediatrician 15 minutes from your clinic is worth fifty who aren’t.' },
  { title: '2 · Open with a short intro email', desc: 'Three sentences: who you are, your current capacity and payers, and how to refer a family. No brochure attachments — make referring effortless.' },
  { title: '3 · Follow up by phone', desc: 'Direct lines mean you skip the front desk. One call to introduce your intake coordinator turns a cold name into a warm referral relationship.' },
  { title: '4 · Give them a reason to remember you', desc: 'Fast answers win referrals: pediatricians keep sending families to the practice that responds same-day and reports back on how the family is doing.' },
];

export default function ReferralContactsPage() {
  useReveal();
  useSeo({
    title: `Free Pediatric Referral Contact List — ${STATS.total.toLocaleString()} Contacts, ${STATS.stateCount} States | Carelu`,
    description: `The most complete referral-outreach dataset for ABA and pediatric therapy providers: ${STATS.total.toLocaleString()} pediatricians and child-development professionals across ${STATS.stateCount} states, with verified emails, direct phones and LinkedIn. Free CSV downloads.`,
    canonical: '/resources/pediatrician-referral-contacts',
  });
  useDatasetJsonLd();

  const { pendingFile, download, clear } = useGatedDownload();

  const statTiles = [
    { n: STATS.total.toLocaleString(), label: 'referral contacts' },
    { n: String(STATS.stateCount), label: 'states covered' },
    { n: STATS.emails.toLocaleString(), label: 'verified emails' },
    { n: STATS.phones.toLocaleString(), label: 'phone numbers (direct & practice)' },
    { n: STATS.linkedin.toLocaleString(), label: 'LinkedIn profiles' },
  ];

  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />
      {pendingFile && <GateModal pendingFile={pendingFile} onDone={clear} />}

      {/* Hero */}
      <section style={{ paddingTop: 'clamp(150px, 18vw, 210px)', paddingBottom: 'clamp(32px, 4.5vw, 56px)', textAlign: 'center' }}>
        <div style={W}>
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
            fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.8vw, 64px)',
            fontWeight: 400, color: INK, lineHeight: 1.08,
            letterSpacing: '-0.022em', margin: '26px auto 0', maxWidth: 880,
          }}>
            Every pediatric referral contact your growth team needs.
          </h1>
          <p className="rv d2" style={{
            fontSize: 'clamp(16px, 1.6vw, 18.5px)', color: 'rgba(43,42,38,0.72)',
            lineHeight: 1.7, maxWidth: 680, margin: '22px auto 0',
          }}>
            {STATS.total.toLocaleString()} pediatricians, developmental specialists, child psychologists
            and clinical social workers across all 50 states and Washington D.C. — with verified emails
            and a phone number for nearly every contact. Built on the federal NPI registry and enriched
            through dozens of provider sources. Free, by state, in clean CSV.
          </p>
          <div className="rv d3" style={{ marginTop: 30 }}>
            <button
              onClick={() => download(STATS.combinedFile)}
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
              Download all {STATS.stateCount} states (CSV)
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
            </button>
            <p style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.5)', margin: '12px 0 0' }}>
              No email required — or grab a single state below.
            </p>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section style={{ paddingBottom: 'clamp(20px, 3vw, 36px)' }}>
        <div style={W}>
          <div className="rv" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12,
          }}>
            {statTiles.map((s) => (
              <div key={s.label} style={{
                background: '#fff', borderRadius: 16, padding: '22px 18px', textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 2.6vw, 34px)', color: INK, letterSpacing: '-0.02em' }}>{s.n}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.55)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview table */}
      <section style={{ paddingTop: 'clamp(22px, 3vw, 36px)' }}>
        <div style={W}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.7vw, 33px)',
            fontWeight: 400, color: INK, lineHeight: 1.18,
            letterSpacing: '-0.015em', margin: '0 0 6px', textAlign: 'center',
          }}>A sample of what&apos;s inside</h2>
          <p className="rv" style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.6)', textAlign: 'center', margin: '0 0 22px' }}>
            Contact details shown masked here — every download contains the full, unmasked record.
          </p>
          <div className="rv" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${HAIR}` }}>
                    {['Name', 'Title', 'Organization', 'State', 'Email', 'Phone'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '14px 14px', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STATS.samples.map((r, i) => (
                    <tr key={r.name} style={{ borderBottom: i < STATS.samples.length - 1 ? `1px solid ${HAIR}` : 'none' }}>
                      <td style={{ padding: '13px 14px', fontSize: 14, fontWeight: 600, color: INK }}>{r.name}</td>
                      <td style={{ padding: '13px 14px', fontSize: 13.5, color: 'rgba(43,42,38,0.65)' }}>{r.title}</td>
                      <td style={{ padding: '13px 14px', fontSize: 13.5, color: 'rgba(43,42,38,0.65)' }}>{r.org}</td>
                      <td style={{ padding: '13px 14px', fontSize: 13.5, color: 'rgba(43,42,38,0.65)', whiteSpace: 'nowrap' }}>{r.state}</td>
                      <td style={{ padding: '13px 14px', fontSize: 12.5, color: 'rgba(43,42,38,0.65)', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{r.email}</td>
                      <td style={{ padding: '13px 14px', fontSize: 12.5, color: 'rgba(43,42,38,0.65)', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{r.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* State grid */}
      <section style={{ paddingTop: 'clamp(40px, 5.5vw, 64px)' }}>
        <div style={W}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.7vw, 33px)',
            fontWeight: 400, color: INK, lineHeight: 1.18,
            letterSpacing: '-0.015em', margin: '0 0 22px', textAlign: 'center',
          }}>Download by state</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
            {STATS.states.map((s) => (
              <div key={s.slug} className="rv" style={{
                background: '#fff', borderRadius: 16, padding: '20px 22px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div>
                  <a href={`/resources/pediatrician-referral-contacts/${s.slug}`} style={{ fontSize: 16, fontWeight: 700, color: INK, letterSpacing: '-0.005em', textDecoration: 'none' }}>{s.name}</a>
                  <div style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.55)', marginTop: 3 }}>
                    {s.count.toLocaleString()} contacts
                    {s.emails > 0 && <> · {s.emails.toLocaleString()} emails</>}
                    {' '}· {s.phones.toLocaleString()} phones
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => download(s.file)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      fontSize: 13, fontWeight: 600, color: GREEN,
                      background: 'rgba(63,122,52,0.08)', border: 'none', cursor: 'pointer',
                      padding: '9px 16px', borderRadius: 100, fontFamily: 'var(--font-body)',
                    }}
                  >
                    Download CSV
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
                  </button>
                  <a href={`/resources/pediatrician-referral-contacts/${s.slug}`} style={{
                    fontSize: 13, fontWeight: 600, color: 'rgba(43,42,38,0.55)', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                  }}>
                    Browse
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why referrals */}
      <section style={{ paddingTop: 'clamp(48px, 7vw, 84px)' }}>
        <div style={MEASURE}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.7vw, 33px)',
            fontWeight: 400, color: INK, lineHeight: 1.18,
            letterSpacing: '-0.015em', margin: '0 0 16px',
          }}>Why pediatrician outreach out-earns every ad channel</h2>
          <p className="rv" style={{ fontSize: 16, color: 'rgba(43,42,38,0.72)', lineHeight: 1.75, margin: '0 0 16px' }}>
            When a parent worries about their child&apos;s development, the first call is almost never to
            an ABA provider — it&apos;s to their pediatrician. That doctor&apos;s recommendation decides where
            the family goes next. Providers who invest in those relationships build a referral engine
            that no advertising budget can match: higher-intent families, lower acquisition cost, and a
            pipeline that keeps flowing without a monthly spend.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
            {WHY_CARDS.map((c) => (
              <div key={c.title} className="rv" style={{
                background: '#fff', borderRadius: 16, padding: 'clamp(18px, 2.4vw, 24px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
              }}>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: INK, margin: '0 0 6px', letterSpacing: '-0.005em', fontFamily: 'var(--font-body)' }}>{c.title}</h3>
                <p style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.65)', lineHeight: 1.65, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's inside + how it was built */}
      <section style={{ paddingTop: 'clamp(40px, 5.5vw, 64px)' }}>
        <div style={MEASURE}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.7vw, 33px)',
            fontWeight: 400, color: INK, lineHeight: 1.18,
            letterSpacing: '-0.015em', margin: '0 0 16px',
          }}>The most complete list of its kind</h2>
          <p className="rv" style={{ fontSize: 16, color: 'rgba(43,42,38,0.72)', lineHeight: 1.75, margin: '0 0 16px' }}>
            Generic contact databases treat pediatric professionals as an afterthought — a title filter
            over stale records. This dataset starts from the federal NPI registry — the government&apos;s
            own roster of every licensed provider — so no pediatrician is missing, then layers on
            enrichment cross-checked through dozens of provider sources: verified work emails, direct
            dials, practice websites and LinkedIn profiles. Deduplicated across states and kept current
            with ongoing re-verification, we believe it&apos;s the best pediatric referral resource
            available anywhere on the web — and you can browse every state&apos;s list right here on
            the site.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
            {INSIDE_CARDS.map((c) => (
              <div key={c.title} className="rv" style={{
                background: '#fff', borderRadius: 16, padding: 'clamp(18px, 2.4vw, 24px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
              }}>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: INK, margin: '0 0 6px', letterSpacing: '-0.005em', fontFamily: 'var(--font-body)' }}>{c.title}</h3>
                <p style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.65)', lineHeight: 1.65, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Playbook */}
      <section style={{ paddingTop: 'clamp(40px, 5.5vw, 64px)' }}>
        <div style={MEASURE}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.7vw, 33px)',
            fontWeight: 400, color: INK, lineHeight: 1.18,
            letterSpacing: '-0.015em', margin: '0 0 16px',
          }}>The outreach playbook</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
            {PLAYBOOK_CARDS.map((c) => (
              <div key={c.title} className="rv" style={{
                background: '#fff', borderRadius: 16, padding: 'clamp(18px, 2.4vw, 24px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
              }}>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: INK, margin: '0 0 6px', letterSpacing: '-0.005em', fontFamily: 'var(--font-body)' }}>{c.title}</h3>
                <p style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.65)', lineHeight: 1.65, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
          <p className="rv" style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.55)', lineHeight: 1.7, margin: '18px 0 0' }}>
            A note on compliance: B2B outreach to professionals is governed by CAN-SPAM — identify
            yourself truthfully, include your physical address, and honor opt-outs promptly. Treat every
            message as the first impression of your practice, because for that pediatrician, it is.
          </p>
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
            {FAQ.map((f) => (
              <div key={f.q} className="rv" style={{ borderTop: `1px solid ${HAIR}`, padding: '18px 0' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: INK, margin: '0 0 8px', fontFamily: 'var(--font-body)' }}>{f.q}</h3>
                <p style={{ fontSize: 15, color: 'rgba(43,42,38,0.68)', lineHeight: 1.7, margin: 0 }}>{f.a}</p>
              </div>
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
            Outreach fills the top of your funnel — Carelu makes sure every referred family gets an
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
