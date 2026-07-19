import { useEffect, useState } from 'react';

/* ────────────────────────────────────────────────────────────────
   Carelu cookie consent — a conventional (OneTrust/Cookiebot-style)
   consent UI wired to Google Consent Mode v2. The gtag default is set
   to "denied" in index.html; this flips it to "granted" per choice.

   Layout: a full-width bottom bar (Reject All / Customize / Accept All)
   plus a centered preferences modal for granular category control.

   Categories:
     - Necessary  : always on (reserved; no cookies of ours today)
     - Analytics  : analytics_storage
     - Marketing  : ad_storage / ad_user_data / ad_personalization

   Choice persists in localStorage (carelu_cookie_consent_v1); index.html
   re-applies it on every load before the tag runs. Reopen anytime via
   window.careluOpenCookiePrefs() (footer "Cookie preferences" link).
   ──────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'carelu_cookie_consent_v1';
const GREEN = '#3f7a34';
const GREEN_DK = '#2e5a26';
const INK = '#1f2620';
const INK_SOFT = '#565c50';

type Categories = { analytics: boolean; marketing: boolean };
type Stored = { choice: 'all' | 'reject' | 'custom'; categories: Categories; ts: number };

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    careluOpenCookiePrefs?: () => void;
  }
}

function applyConsent(categories: Categories) {
  window.gtag?.('consent', 'update', {
    ad_storage: categories.marketing ? 'granted' : 'denied',
    ad_user_data: categories.marketing ? 'granted' : 'denied',
    ad_personalization: categories.marketing ? 'granted' : 'denied',
    analytics_storage: categories.analytics ? 'granted' : 'denied',
  });
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);      // bottom bar visible
  const [modal, setModal] = useState(false);    // preferences modal visible
  const [cats, setCats] = useState<Categories>({ analytics: false, marketing: false });

  useEffect(() => {
    let stored: Stored | null = null;
    try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { /* ignore */ }
    if (!stored?.choice) setOpen(true);
    else setCats(stored.categories);
    window.careluOpenCookiePrefs = () => { setModal(true); };
    return () => { delete window.careluOpenCookiePrefs; };
  }, []);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal]);

  const save = (choice: Stored['choice'], categories: Categories) => {
    const record: Stored = { choice, categories, ts: Date.now() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(record)); } catch { /* ignore */ }
    applyConsent(categories);
    setOpen(false);
    setModal(false);
  };

  if (!open && !modal) return null;

  const acceptAll = () => save('all', { analytics: true, marketing: true });
  const rejectAll = () => save('reject', { analytics: false, marketing: false });
  const saveChoices = () => save('custom', cats);

  return (
    <>
      {open && !modal && (
        <div role="dialog" aria-label="Cookie consent" aria-live="polite" className="cookie-bar" style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 9998,
          background: '#ffffff', borderTop: '1px solid rgba(31,38,32,0.12)',
          boxShadow: '0 -6px 30px rgba(20,30,18,0.10)',
          padding: 'clamp(16px, 2vw, 20px) clamp(16px, 4vw, 40px)',
          animation: 'cookieIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto',
            display: 'flex', alignItems: 'center', gap: 'clamp(16px, 3vw, 40px)', flexWrap: 'wrap',
          }}>
            <div style={{ flex: '1 1 440px', minWidth: 240 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: INK, marginBottom: 4 }}>
                We value your privacy
              </div>
              <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.5, color: INK_SOFT }}>
                We use cookies to run our site, analyze traffic, and improve our marketing.
                By clicking “Accept all,” you consent to our use of cookies. Read our{' '}
                <a href="/terms" style={{ color: GREEN_DK, fontWeight: 600, textDecoration: 'underline' }}>Cookie&nbsp;Policy</a>.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={() => setModal(true)} className="cc-btn cc-outline">Customize</button>
              <button onClick={rejectAll} className="cc-btn cc-outline">Reject all</button>
              <button onClick={acceptAll} className="cc-btn cc-solid">Accept all</button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div
          className="cookie-overlay"
          onMouseDown={(e) => { if (e.target === e.currentTarget && !open) setModal(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(24,30,22,0.45)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            animation: 'cookieFade 0.25s ease both',
          }}
        >
          <div role="dialog" aria-modal="true" aria-label="Cookie preferences" style={{
            width: 'min(560px, 100%)', maxHeight: '86vh', overflowY: 'auto',
            background: '#ffffff', borderRadius: 14, border: '1px solid rgba(31,38,32,0.10)',
            boxShadow: '0 40px 90px rgba(20,30,18,0.32)', padding: 'clamp(22px, 3vw, 30px)',
            animation: 'cookieIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 700, color: INK, letterSpacing: '-0.01em' }}>
                Cookie preferences
              </h2>
              {!open && (
                <button aria-label="Close" onClick={() => setModal(false)} style={{
                  border: 'none', background: 'transparent', cursor: 'pointer', color: INK_SOFT, padding: 4, lineHeight: 0,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              )}
            </div>
            <p style={{ margin: '10px 0 4px', fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.6, color: INK_SOFT }}>
              We use cookies to help you navigate efficiently and perform certain functions.
              Choose which categories you consent to below. See our{' '}
              <a href="/terms" style={{ color: GREEN_DK, fontWeight: 600, textDecoration: 'underline' }}>Cookie&nbsp;Policy</a>.
            </p>

            <div style={{ margin: '18px 0 4px' }}>
              <CatRow title="Strictly necessary" desc="Essential for the website to function. These are always active." checked disabled />
              <CatRow title="Analytics" desc="Help us understand how visitors interact with the site." checked={cats.analytics} onChange={(v) => setCats((c) => ({ ...c, analytics: v }))} />
              <CatRow title="Marketing" desc="Used to deliver and measure the effectiveness of our advertising." checked={cats.marketing} onChange={(v) => setCats((c) => ({ ...c, marketing: v }))} last />
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 22 }}>
              <button onClick={rejectAll} className="cc-btn cc-outline">Reject all</button>
              <button onClick={saveChoices} className="cc-btn cc-outline">Save choices</button>
              <div style={{ flex: 1 }} />
              <button onClick={acceptAll} className="cc-btn cc-solid">Accept all</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CatRow({ title, desc, checked, disabled, last, onChange }: {
  title: string; desc: string; checked: boolean; disabled?: boolean; last?: boolean; onChange?: (v: boolean) => void;
}) {
  return (
    <label style={{
      display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0',
      borderTop: '1px solid rgba(31,38,32,0.09)',
      borderBottom: last ? '1px solid rgba(31,38,32,0.09)' : 'none',
      cursor: disabled ? 'default' : 'pointer',
    }}>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: INK }}>{title}</span>
        <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 12.5, color: '#6f7565', lineHeight: 1.5, marginTop: 2 }}>{desc}</span>
      </span>
      {disabled ? (
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: GREEN, whiteSpace: 'nowrap', marginTop: 2 }}>Always on</span>
      ) : (
        <button
          type="button" role="switch" aria-checked={checked} aria-label={title}
          onClick={() => onChange?.(!checked)}
          style={{
            flexShrink: 0, marginTop: 1, width: 42, height: 24, borderRadius: 100, border: 'none',
            background: checked ? GREEN : 'rgba(90,99,82,0.32)', cursor: 'pointer',
            position: 'relative', transition: 'background 0.22s ease',
          }}
        >
          <span style={{
            position: 'absolute', top: 3, left: checked ? 21 : 3, width: 18, height: 18,
            borderRadius: '50%', background: '#fff', transition: 'left 0.22s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.28)',
          }} />
        </button>
      )}
    </label>
  );
}
