// ── SITE FOOTER ──────────────────────────────────
// The full landscape footer. Lives on the home page and every Carelu marketing
// page. NOT for the LeadTrap-domain pages (Gateway, Company, LeadTrap legal) —
// those are LeadTrap-branded and keep their own footer.
//
// The headline is a prop because the default copy is pediatric-specific; pages
// for non-pediatric segments (home care, hospice, addiction treatment) should
// pass their own.
//
// Requires useReveal() on the host page — the headline and subhead carry .rv
// classes and start at opacity 0 until the observer marks them visible.

const DEFAULT_HEADLINE = 'Somewhere right now, a parent is searching for care for their child.';
const DEFAULT_SUBHEAD = "Let's make sure they find you — and that when they do, someone's there.";

const columns: { title: string; links: string[] }[] = [
  { title: 'Product',    links: ['Intake AI', 'Insurance Verification', 'Document Collection', 'Follow-ups', 'Scheduling'] },
  { title: 'Industries', links: ['ABA Therapy', 'Mental Health', 'Home Care', 'Addiction Treatment', 'Hospice'] },
  { title: 'Customers',  links: ['Single-Site', 'Multi-Site', 'Enterprise'] },
  { title: 'Company',    links: ['About', 'Careers', 'News', 'Contact'] },
  { title: 'Resources',  links: ['The Intake Gap (Research)', 'Intake Leak Calculator', 'Intake Guides', 'Payer Guides', 'Referral Contacts', 'Front-Office Risks', 'Integrations', 'Carelu vs a CRM', 'Trust'] },
];

// Section anchors resolve against the home page, which is `/` on carelu.com and
// `/carelu` everywhere else — same rule the nav uses.
const isCareluDomain = /(^|\.)carelu\.com$/i.test(window.location.hostname);
const home = isCareluDomain ? '/' : '/carelu';

const HREFS: Record<string, string> = {
  'Intake AI': `${home}#platform`,
  'Insurance Verification': '/payers',
  'Document Collection': '/resources/aba-intake-forms',
  'Follow-ups': '/resources/aba-intake-drop-off',
  'Scheduling': `${home}#how-it-works`,
  'ABA Therapy': '/for/aba-therapy',
  'Mental Health': '/for/mental-health',
  'Home Care': '/for/home-care',
  'Addiction Treatment': '/for/addiction-treatment',
  'Hospice': '/for/hospice',
  'Single-Site': '/solutions/single-site',
  'Multi-Site': '/solutions/multi-site',
  'Enterprise': '/solutions/enterprise',
  'About': '/carelu/company',
  'Careers': '/carelu/company#careers',
  'News': '/news',
  'Contact': '/demo',
  'The Intake Gap (Research)': '/research/the-intake-gap',
  'Intake Leak Calculator': '/tools/intake-leak-calculator',
  'Intake Guides': '/resources/aba-client-intake-process',
  'Payer Guides': '/payers',
  'Referral Contacts': '/resources/pediatrician-referral-contacts',
  'Front-Office Risks': '/aba-front-office-risks',
  'Integrations': '/integrations',
  'Carelu vs a CRM': '/carelu-vs-crm',
  'Trust': 'https://trust.carelu.com',
};

// The footer is always the light landscape design, whatever theme the host page
// runs in. --bone is near-black in :root and only cream under .session-light,
// which SegmentPage doesn't set — so the cream is hard-coded here rather than
// inherited, and a new page can't silently reintroduce the dark-text bug.
const CREAM = '#FAF8F3';

const LINK_REST = { fontSize: 12, color: 'rgba(250,248,243,0.7)', textDecoration: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.18)' } as const;

export default function SiteFooter({
  headline = DEFAULT_HEADLINE,
  subhead = DEFAULT_SUBHEAD,
}: { headline?: string; subhead?: string } = {}) {
  return (
    <footer style={{
      position: 'relative',
      padding: 'clamp(260px, 26vw, 400px) 36px 36px',
      background: CREAM,
      overflow: 'hidden',
    }}>
      {/* Landscape image — at 80% opacity so it stays the dominant background but with a softer feel */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/footer-landscape-new.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        backgroundRepeat: 'no-repeat',
        opacity: 0.8,
        pointerEvents: 'none',
      }} />
      {/* Top cream fade — blends the landscape into the bone page background above */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 'clamp(140px, 18vw, 240px)',
        background: `linear-gradient(180deg, ${CREAM} 0%, rgba(250,248,243,0.85) 35%, rgba(250,248,243,0) 100%)`,
        pointerEvents: 'none', zIndex: 2,
      }} />
      {/* Dark wash for white text legibility */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(20,30,25,0.06) 0%, rgba(20,30,25,0.20) 55%, rgba(20,30,25,0.38) 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
        {/* Headline */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(60px, 8vw, 100px)' }}>
          <h2 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.2vw, 52px)',
            fontWeight: 400, color: CREAM,
            lineHeight: 1.12, letterSpacing: '-0.02em',
            maxWidth: 860, margin: '0 auto 14px',
            textShadow: '0 2px 16px rgba(0,0,0,0.25)',
          }}>
            {headline}
          </h2>
          <p className="rv d2" style={{
            fontSize: 15, color: 'rgba(250,248,243,0.82)', lineHeight: 1.7,
            maxWidth: 560, margin: '0 auto',
            textShadow: '0 1px 8px rgba(0,0,0,0.2)',
          }}>
            {subhead}
          </p>
        </div>

        {/* Link columns */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 32, marginBottom: 80,
        }} className="footer-grid">
          {columns.map((col) => (
            <div key={col.title}>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13, fontWeight: 600, color: CREAM,
                marginBottom: 16,
                textShadow: '0 1px 6px rgba(0,0,0,0.2)',
              }}>
                {col.title}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href={HREFS[link] ?? '#'}
                      {...(link === 'Trust' ? { target: '_blank', rel: 'noreferrer' } : {})}
                      style={{
                        fontSize: 13, color: 'rgba(250,248,243,0.75)',
                        textDecoration: 'none', transition: 'color 0.2s',
                        textShadow: '0 1px 4px rgba(0,0,0,0.18)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = CREAM; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(250,248,243,0.75)'; }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row: brand + legal */}
        <div style={{
          paddingTop: 28, borderTop: '1px solid rgba(250,248,243,0.22)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img
              src="/carelu-logo.svg"
              alt="Carelu"
              style={{
                height: 24, width: 'auto', display: 'block',
                filter: 'brightness(0) invert(1) drop-shadow(0 1px 6px rgba(0,0,0,0.2))',
              }}
            />
            <span style={{
              width: 1, height: 18, background: 'rgba(250,248,243,0.32)', display: 'inline-block',
            }} />
            <span style={{
              fontSize: 11, color: 'rgba(250,248,243,0.7)',
              fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase',
              textShadow: '0 1px 4px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap',
            }}>
              Powered by
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <img
                src="/leadtrap-mark.svg"
                alt=""
                style={{
                  height: 18, width: 18, display: 'block', borderRadius: '50%',
                  filter: 'invert(1) drop-shadow(0 1px 6px rgba(0,0,0,0.2))',
                }}
              />
              <span style={{
                fontSize: 11.5, fontWeight: 700, color: '#fff',
                textShadow: '0 1px 4px rgba(0,0,0,0.2)', letterSpacing: '-0.01em',
              }}>
                LeadTrap
              </span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="/privacy" style={LINK_REST}>Privacy Policy</a>
            <a href="/cookies" style={LINK_REST}>Cookie Policy</a>
            <a href="/terms" style={LINK_REST}>Terms</a>
            <button
              onClick={() => window.careluOpenCookiePrefs?.()}
              style={{ ...LINK_REST, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
            >Cookie preferences</button>
            <a href="https://trust.carelu.com" target="_blank" rel="noreferrer" style={LINK_REST}>Security</a>
            <span style={LINK_REST}>HIPAA · SOC 2</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
