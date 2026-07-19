import { useEffect, useState } from 'react';

/* ────────────────────────────────────────────────────────────────
   Carelu cookie consent — a lightweight, on-brand banner wired to
   Google Consent Mode v2 (the gtag default is set to "denied" in
   index.html; this flips it to "granted" per the visitor's choice).

   Categories:
     - Necessary  : always on (no cookies of ours today; reserved)
     - Analytics  : analytics_storage
     - Marketing  : ad_storage / ad_user_data / ad_personalization
                    (this is what the Google Ads tag uses)

   Choice is persisted in localStorage under carelu_cookie_consent_v1;
   index.html re-applies it on every load before the tag runs.
   Reopen anytime via window.careluOpenCookiePrefs() (footer link).
   ──────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'carelu_cookie_consent_v1';
const GREEN = '#3f7a34';
const GREEN_DK = '#2e5a26';
const INK = '#26301f';
const INK_SOFT = '#5c6353';

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
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [cats, setCats] = useState<Categories>({ analytics: false, marketing: false });

  useEffect(() => {
    let stored: Stored | null = null;
    try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { /* ignore */ }
    if (!stored?.choice) setOpen(true);
    else setCats(stored.categories);
    // Let a footer link (or anything) reopen the preferences
    window.careluOpenCookiePrefs = () => { setManage(true); setOpen(true); };
    return () => { delete window.careluOpenCookiePrefs; };
  }, []);

  const save = (choice: Stored['choice'], categories: Categories) => {
    const record: Stored = { choice, categories, ts: Date.now() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(record)); } catch { /* ignore */ }
    applyConsent(categories);
    setOpen(false);
    setManage(false);
  };

  if (!open) return null;

  const acceptAll = () => save('all', { analytics: true, marketing: true });
  const rejectAll = () => save('reject', { analytics: false, marketing: false });
  const saveChoices = () => save('custom', cats);

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="cookie-consent"
      style={{
        position: 'fixed', zIndex: 9999,
        left: 'clamp(12px, 2.4vw, 26px)', bottom: 'clamp(12px, 2.4vw, 26px)',
        width: 'min(408px, calc(100vw - 24px))',
        background: 'linear-gradient(176deg, #ffffff 0%, #fbfaf5 100%)',
        border: '1px solid rgba(47,58,38,0.10)',
        borderRadius: 20,
        boxShadow: '0 1px 2px rgba(30,42,24,0.05), 0 28px 56px -20px rgba(28,46,22,0.30)',
        padding: 'clamp(20px, 2.4vw, 26px)',
        animation: 'cookieIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span aria-hidden style={{
          flexShrink: 0, width: 36, height: 36, borderRadius: 12,
          background: 'rgba(63,122,52,0.10)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </span>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: INK, letterSpacing: '-0.015em' }}>
          A note on your privacy
        </h2>
      </div>

      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: INK_SOFT }}>
        We use cookies to run Carelu and, with your consent, to measure traffic and
        improve our marketing. Read our{' '}
        <a href="/terms" style={{ color: GREEN_DK, fontWeight: 600, textDecoration: 'none', borderBottom: `1px solid rgba(63,122,52,0.4)`, paddingBottom: 1 }}>privacy&nbsp;policy</a>.
      </p>

      {manage && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column' }}>
          <CatRow title="Strictly necessary" desc="Required for the site to work. Always on." checked disabled first />
          <CatRow title="Analytics" desc="Helps us understand how the site is used." checked={cats.analytics} onChange={(v) => setCats((c) => ({ ...c, analytics: v }))} />
          <CatRow title="Marketing" desc="Used to measure and improve our ads." checked={cats.marketing} onChange={(v) => setCats((c) => ({ ...c, marketing: v }))} />
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20, alignItems: 'center' }}>
        {!manage ? (
          <button onClick={() => setManage(true)} style={linkBtn} className="cc-link">Customize</button>
        ) : (
          <button onClick={saveChoices} style={linkBtn} className="cc-link">Save choices</button>
        )}
        <div style={{ flex: 1 }} />
        <button onClick={rejectAll} style={ghostBtn} className="cc-ghost">Reject</button>
        <button onClick={acceptAll} style={solidBtn} className="cc-solid">Accept all</button>
      </div>
    </div>
  );
}

function CatRow({ title, desc, checked, disabled, first, onChange }: {
  title: string; desc: string; checked: boolean; disabled?: boolean; first?: boolean; onChange?: (v: boolean) => void;
}) {
  return (
    <label style={{
      display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0',
      borderTop: first ? '1px solid rgba(47,58,38,0.09)' : 'none',
      borderBottom: '1px solid rgba(47,58,38,0.09)',
      cursor: disabled ? 'default' : 'pointer',
    }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        style={{
          flexShrink: 0, marginTop: 1, width: 36, height: 21, borderRadius: 100, border: 'none',
          background: checked ? GREEN : 'rgba(90,99,82,0.30)',
          opacity: disabled ? 0.55 : 1, cursor: disabled ? 'default' : 'pointer',
          position: 'relative', transition: 'background 0.22s ease',
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked ? 18 : 3, width: 15, height: 15,
          borderRadius: '50%', background: '#fff', transition: 'left 0.22s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.28)',
        }} />
      </button>
      <span>
        <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: INK, letterSpacing: '-0.005em' }}>{title}</span>
        <span style={{ display: 'block', fontSize: 12, color: '#767c6b', lineHeight: 1.45, marginTop: 1 }}>{desc}</span>
      </span>
    </label>
  );
}

const baseBtn: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
  padding: '10px 20px', borderRadius: 100, transition: 'transform 0.18s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease',
  whiteSpace: 'nowrap', letterSpacing: '-0.005em',
};
const solidBtn: React.CSSProperties = {
  ...baseBtn, color: '#fff', border: '1px solid transparent',
  background: `linear-gradient(180deg, #468739, ${GREEN})`,
  boxShadow: '0 2px 6px rgba(46,90,38,0.30)',
};
const ghostBtn: React.CSSProperties = { ...baseBtn, color: INK, background: 'transparent', border: '1px solid rgba(47,58,38,0.22)' };
const linkBtn: React.CSSProperties = { ...baseBtn, color: GREEN_DK, background: 'transparent', border: 'none', padding: '10px 2px' };
