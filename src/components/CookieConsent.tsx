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
const INK = '#1f2a1c';

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
        left: 'clamp(12px, 3vw, 28px)', bottom: 'clamp(12px, 3vw, 28px)',
        width: 'min(440px, calc(100vw - 24px))',
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(60,70,50,0.14)',
        borderRadius: 18,
        boxShadow: '0 24px 60px rgba(20,30,18,0.22)',
        padding: 'clamp(18px, 2.6vw, 24px)',
        animation: 'cookieIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }} aria-hidden>🍪</span>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 500, color: INK, letterSpacing: '-0.01em' }}>
          Your privacy
        </h2>
      </div>

      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: '#4a5142' }}>
        We use cookies to run the site and, with your okay, to measure traffic and
        improve our marketing. You can accept all, reject non-essential, or choose
        what’s on. See our{' '}
        <a href="/terms" style={{ color: GREEN_DK, fontWeight: 600, textDecoration: 'underline' }}>privacy&nbsp;policy</a>.
      </p>

      {manage && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CatRow
            title="Strictly necessary"
            desc="Required for the site to work. Always on."
            checked disabled
          />
          <CatRow
            title="Analytics"
            desc="Helps us understand how the site is used."
            checked={cats.analytics}
            onChange={(v) => setCats((c) => ({ ...c, analytics: v }))}
          />
          <CatRow
            title="Marketing"
            desc="Used to measure and improve our ads."
            checked={cats.marketing}
            onChange={(v) => setCats((c) => ({ ...c, marketing: v }))}
          />
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 18, alignItems: 'center' }}>
        {!manage ? (
          <button onClick={() => setManage(true)} style={linkBtn}>Manage</button>
        ) : (
          <button onClick={saveChoices} style={linkBtn}>Save choices</button>
        )}
        <div style={{ flex: 1 }} />
        <button onClick={rejectAll} style={ghostBtn}>Reject</button>
        <button onClick={acceptAll} style={solidBtn}>Accept all</button>
      </div>
    </div>
  );
}

function CatRow({ title, desc, checked, disabled, onChange }: {
  title: string; desc: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void;
}) {
  return (
    <label style={{
      display: 'flex', alignItems: 'flex-start', gap: 11, padding: '10px 0',
      borderTop: '1px solid rgba(60,70,50,0.08)', cursor: disabled ? 'default' : 'pointer',
    }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        style={{
          flexShrink: 0, marginTop: 2, width: 38, height: 22, borderRadius: 100, border: 'none',
          background: checked ? GREEN : 'rgba(120,128,110,0.35)',
          opacity: disabled ? 0.6 : 1, cursor: disabled ? 'default' : 'pointer',
          position: 'relative', transition: 'background 0.2s ease',
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked ? 19 : 3, width: 16, height: 16,
          borderRadius: '50%', background: '#fff', transition: 'left 0.2s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
        }} />
      </button>
      <span>
        <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: INK }}>{title}</span>
        <span style={{ display: 'block', fontSize: 12, color: '#6a715f', lineHeight: 1.4 }}>{desc}</span>
      </span>
    </label>
  );
}

const baseBtn: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
  padding: '9px 18px', borderRadius: 100, transition: 'all 0.18s ease', whiteSpace: 'nowrap',
};
const solidBtn: React.CSSProperties = { ...baseBtn, color: '#fff', background: GREEN, border: `1px solid ${GREEN}` };
const ghostBtn: React.CSSProperties = { ...baseBtn, color: INK, background: 'transparent', border: '1px solid rgba(60,70,50,0.28)' };
const linkBtn: React.CSSProperties = { ...baseBtn, color: GREEN_DK, background: 'transparent', border: 'none', padding: '9px 4px', textDecoration: 'underline' };
