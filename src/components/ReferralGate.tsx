import { useRef, useState } from 'react';

/* ================================================================
   Soft email gate for the referral-contacts dataset downloads.
   Shared by the hub page and the per-state pages. The modal asks
   for a work email but is fully dismissible — X, overlay click and
   "Skip" all still trigger the pending download. Given emails POST
   to /api/leads (fire-and-forget).
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const GREEN = '#3f7a34';

const EMAIL_RE = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const GIVEN_KEY = 'carelu_leads_email';
const SKIP_KEY = 'carelu_refdir_skip';

export function triggerDownload(file: string) {
  const a = document.createElement('a');
  a.href = file;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* Gate state: call download(file); it either downloads immediately (already
   unlocked) or stages the file and opens the modal. */
export function useGatedDownload() {
  const [pendingFile, setPendingFile] = useState<string | null>(null);
  const download = (file: string) => {
    let unlocked = false;
    try {
      unlocked = !!localStorage.getItem(GIVEN_KEY) || !!sessionStorage.getItem(SKIP_KEY);
    } catch { /* private mode */ }
    if (unlocked) triggerDownload(file);
    else setPendingFile(file);
  };
  return { pendingFile, download, clear: () => setPendingFile(null) };
}

export function GateModal({ pendingFile, onDone }: { pendingFile: string; onDone: () => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const hpRef = useRef<HTMLInputElement>(null);

  const proceed = () => {
    triggerDownload(pendingFile);
    onDone();
  };

  const skip = () => {
    try { sessionStorage.setItem(SKIP_KEY, '1'); } catch { /* private mode */ }
    proceed();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim();
    if (!EMAIL_RE.test(clean)) { setError('That doesn’t look like an email — or just skip below.'); return; }
    try { localStorage.setItem(GIVEN_KEY, clean); } catch { /* private mode */ }
    // Fire-and-forget: never make the visitor wait on storage.
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: clean, source: 'referral-contacts', website: hpRef.current?.value ?? '' }),
      keepalive: true,
    }).catch(() => {});
    proceed();
  };

  return (
    <div
      onClick={skip}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(26,26,26,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Get dataset updates"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative', background: '#fff', borderRadius: 22,
          maxWidth: 440, width: '100%', padding: 'clamp(28px, 4vw, 38px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.28)',
        }}
      >
        <button
          onClick={skip}
          aria-label="Close and download"
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 34, height: 34, borderRadius: 100, border: 'none',
            background: 'rgba(43,42,38,0.06)', color: 'rgba(43,42,38,0.6)',
            fontSize: 16, cursor: 'pointer', lineHeight: 1,
          }}
        >
          ✕
        </button>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400,
          color: INK, letterSpacing: '-0.015em', lineHeight: 1.15, margin: '0 0 10px',
        }}>
          Want the refreshed list when it updates?
        </h3>
        <p style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.65)', lineHeight: 1.6, margin: '0 0 20px' }}>
          This dataset is re-verified on an ongoing basis. Leave your work email and we&apos;ll
          send you the newest version each time it changes. Or skip it — your download starts either way.
        </p>
        <form onSubmit={submit}>
          {/* Honeypot — hidden from humans, bots fill it. */}
          <input ref={hpRef} type="text" name="website" tabIndex={-1} autoComplete="off"
            style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, opacity: 0 }} />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            placeholder="you@yourpractice.com"
            autoFocus
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '14px 18px', borderRadius: 14,
              border: `1.5px solid ${error ? '#c0392b' : 'rgba(43,42,38,0.16)'}`,
              fontSize: 15, color: INK, background: BONE, outline: 'none',
              fontFamily: 'var(--font-body)',
            }}
          />
          {error && <p style={{ fontSize: 12.5, color: '#c0392b', margin: '8px 0 0' }}>{error}</p>}
          <button type="submit" style={{
            width: '100%', marginTop: 12,
            padding: '14px 24px', borderRadius: 100, border: 'none',
            fontSize: 15, fontWeight: 600, color: '#fff', backgroundColor: GREEN,
            cursor: 'pointer', boxShadow: '0 6px 20px rgba(46,90,38,0.24)',
            fontFamily: 'var(--font-body)',
          }}>
            Email me updates &amp; download
          </button>
        </form>
        <button
          onClick={skip}
          style={{
            display: 'block', margin: '14px auto 0',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: 'rgba(43,42,38,0.5)', textDecoration: 'underline',
            fontFamily: 'var(--font-body)',
          }}
        >
          Skip — just download
        </button>
      </div>
    </div>
  );
}
