import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';
import SiteFooter from '../components/SiteFooter';
import { sortedNews, NEWS_TYPE_LABEL } from '../data/news';

/* ================================================================
   CARELU — NEWS (/news)
   Coverage of Carelu. Content lives in src/data/news.ts; adding an
   article is a one-object edit there. Renders an on-brand press-kit
   state while the list is empty so the footer link is never a
   dead end.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const GREEN = '#3f7a34';
const PRESS_EMAIL = 'press@carelu.com';

const W: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

function formatDate(iso: string) {
  // Parse as UTC — `new Date('2026-08-14')` is UTC midnight, which renders as
  // the previous day west of Greenwich if formatted in local time.
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function hostOf(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

export default function News() {
  useReveal();
  useSeo({
    title: 'News — Carelu in the Press',
    description:
      'Coverage of Carelu: articles, interviews, and announcements about the AI front office for behavioral health and home care intake.',
    canonical: '/news',
  });

  const items = sortedNews();

  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />

      <section style={{ paddingTop: 'clamp(150px, 18vw, 210px)', paddingBottom: 'clamp(28px, 4vw, 46px)', textAlign: 'center' }}>
        <div style={W}>
          <div className="rv">
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: INK, background: '#fff', padding: '10px 20px', borderRadius: 100,
              border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
            }}>News</span>
          </div>
          <h1 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.8vw, 64px)', fontWeight: 400,
            color: INK, lineHeight: 1.08, letterSpacing: '-0.02em', margin: '26px auto 0', maxWidth: 760,
          }}>
            Carelu in the press.
          </h1>
          <p className="rv d2" style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'rgba(43,42,38,0.68)',
            lineHeight: 1.65, maxWidth: 560, margin: '22px auto 0',
          }}>
            Where our work — and the families and providers behind it — has been written about.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
        <div style={W}>
          {items.length === 0 ? (
            <div className="rv" style={{
              background: '#fff', borderRadius: 20, padding: 'clamp(28px, 4vw, 44px)', textAlign: 'center',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(21px, 2.4vw, 27px)', fontWeight: 400,
                color: INK, margin: '0 0 10px', letterSpacing: '-0.01em',
              }}>
                Working on a story?
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(43,42,38,0.66)', lineHeight: 1.7, margin: '0 auto', maxWidth: 480 }}>
                We're happy to talk about intake, what the data says about how families
                fall through the cracks, and what providers are doing about it. Reach us at{' '}
                <a href={`mailto:${PRESS_EMAIL}`} style={{ color: '#2e5a26', fontWeight: 600 }}>{PRESS_EMAIL}</a>.
              </p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {items.map((n) => (
                <li key={n.url}>
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rv"
                    style={{
                      display: 'block', background: '#fff', borderRadius: 18,
                      padding: 'clamp(20px, 2.6vw, 28px)', textDecoration: 'none',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
                      transition: 'transform 0.2s, box-shadow 0.25s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.09)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)'; }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: GREEN, marginBottom: 10,
                    }}>
                      <span>{n.outlet}</span>
                      <span aria-hidden style={{ color: 'rgba(43,42,38,0.25)' }}>·</span>
                      <time dateTime={n.date} style={{ color: 'rgba(43,42,38,0.45)', letterSpacing: '0.08em' }}>
                        {formatDate(n.date)}
                      </time>
                      {n.type && n.type !== 'article' && (
                        <span style={{
                          color: 'rgba(43,42,38,0.55)', background: 'rgba(63,122,52,0.08)',
                          borderRadius: 100, padding: '3px 9px', letterSpacing: '0.08em',
                        }}>{NEWS_TYPE_LABEL[n.type]}</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
                      <h2 style={{
                        fontFamily: 'var(--font-display)', fontSize: 'clamp(19px, 2.1vw, 25px)', fontWeight: 400,
                        color: INK, margin: 0, letterSpacing: '-0.01em', lineHeight: 1.25,
                      }}>
                        {n.title}
                      </h2>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 6 }} aria-hidden>
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>

                    {n.excerpt && (
                      <p style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.62)', lineHeight: 1.65, margin: '10px 0 0' }}>
                        {n.excerpt}
                      </p>
                    )}

                    <div style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.4)', marginTop: 12 }}>
                      {hostOf(n.url)}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {items.length > 0 && (
        <section style={{ paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
          <div style={W}>
            <div className="rv" style={{
              background: 'rgba(63,122,52,0.05)', border: '1px dashed rgba(63,122,52,0.35)',
              borderRadius: 16, padding: 'clamp(18px, 2.4vw, 26px)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: INK, marginBottom: 6 }}>Press inquiries</div>
              <p style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.65)', lineHeight: 1.6, margin: 0 }}>
                Writing about intake, access to care, or AI in behavioral health? Reach us at{' '}
                <a href={`mailto:${PRESS_EMAIL}`} style={{ color: '#2e5a26', fontWeight: 600 }}>{PRESS_EMAIL}</a>.
              </p>
            </div>
          </div>
        </section>
      )}

      <section style={{ paddingBottom: 'clamp(80px, 10vw, 130px)', textAlign: 'center' }}>
        <div style={W}>
          <a href="/demo" className="rv" style={{
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

      <SiteFooter />
    </div>
  );
}
