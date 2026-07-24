import { useCallback, useEffect, useRef, useState } from 'react';
import { useSeo } from '../hooks/useSeo';

/* ================================================================
   CARELU — SOURCE DOCUMENTS APP (/sources)
   A Dropbox-style hand-off for the payer-source inbox: the team gets
   a Slack ping with the official download link + this app, logs in,
   drags the PDF onto the matching request card, and it flips
   open -> received. Also surfaces the pipeline heartbeat and the
   event history so the team can see the refresh is alive.

   Standalone page — NO marketing nav, noindex, not in the sitemap.
   Talks only to /api/sources/* (login/logout/state/upload). Backed
   by the private carelu-sources repo. Visual language matches the
   payer directory (sage green, bone, soft rounded cards).
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const GREEN = '#3f7a34';
const GREEN_DK = '#2e5a26';
const HAIR = 'rgba(43,42,38,0.08)';
const MUTE = 'rgba(43,42,38,0.6)';

const ALLOWED = ['.pdf', '.csv', '.xlsx', '.png', '.zip'];
const MAX_BYTES = 40 * 1024 * 1024;

/* ---- types (mirror the /api/sources/state payload) ---------------- */

type ReqStatus = 'open' | 'received' | 'fulfilled';

interface SourceRequest {
  id: string;
  title: string;
  officialUrl_note: string;
  unblocks: string;
  status: ReqStatus;
  requestedAt: string;
  receivedAt: string | null;
  fulfilledAt: string | null;
  uploadedFile: string | null;
}

type EventType = 'request-opened' | 'file-received' | 'request-fulfilled' | 'refresh-completed' | 'refresh-issue';

interface SourceEvent {
  ts: string;
  type: EventType;
  summary: string;
  refId: string | null;
}

interface Heartbeat {
  lastDirectoryRefresh: string | null;
  lastPipelineActivity: string | null;
  lastSourcesCommit: string | null;
  nextScheduledRefresh: string;
  counts: { open: number; received: number; fulfilled: number };
}

interface StatePayload {
  requests: SourceRequest[];
  events: SourceEvent[];
  heartbeat: Heartbeat;
}

/* ---- helpers ------------------------------------------------------ */

// officialUrl_note may be prose; surface the first http(s) URL as the link
// and keep the rest as helper text.
function parseOfficial(note: string): { url: string | null; helper: string } {
  const m = note.match(/https?:\/\/[^\s)]+/);
  if (!m) return { url: null, helper: note };
  const helper = note.replace(m[0], '').replace(/\s+/g, ' ').replace(/^[\s(—-]+|[\s)]+$/g, '').trim();
  return { url: m[0], helper };
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('could not read file'));
    reader.readAsDataURL(file);
  });
}

function extOk(name: string): boolean {
  const lower = name.toLowerCase();
  return ALLOWED.some((e) => lower.endsWith(e));
}

const STATUS_ORDER: Record<ReqStatus, number> = { open: 0, received: 1, fulfilled: 2 };

const EVENT_META: Record<EventType, { icon: string; label: string; color: string }> = {
  'file-received': { icon: '📥', label: 'File received', color: GREEN },
  'request-fulfilled': { icon: '✅', label: 'Request fulfilled', color: GREEN },
  'refresh-completed': { icon: '🔄', label: 'Refresh completed', color: GREEN },
  'refresh-issue': { icon: '⚠️', label: 'Refresh issue', color: '#b8741a' },
  'request-opened': { icon: '📝', label: 'Request opened', color: MUTE },
};

/* ---- small presentational bits ------------------------------------ */

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.06em',
        color: GREEN_DK,
        background: 'rgba(63,122,52,0.1)',
        padding: '4px 10px',
        borderRadius: 100,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

/* ---- upload card --------------------------------------------------- */

interface UploadState {
  phase: 'idle' | 'reading' | 'uploading' | 'done' | 'error';
  progress: number;
  message?: string;
}

function RequestCard({
  req,
  highlighted,
  cardRef,
  onUploaded,
}: {
  req: SourceRequest;
  highlighted: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
  onUploaded: () => void;
}) {
  const [up, setUp] = useState<UploadState>({ phase: 'idle', progress: 0 });
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { url, helper } = parseOfficial(req.officialUrl_note);

  const doUpload = useCallback(
    async (file: File) => {
      if (!extOk(file.name)) {
        setUp({ phase: 'error', progress: 0, message: `Only ${ALLOWED.join(', ')} files are accepted.` });
        return;
      }
      if (file.size > MAX_BYTES) {
        setUp({ phase: 'error', progress: 0, message: 'File exceeds the 40MB limit.' });
        return;
      }
      setUp({ phase: 'reading', progress: 0 });
      let contentBase64: string;
      try {
        contentBase64 = await fileToBase64(file);
      } catch {
        setUp({ phase: 'error', progress: 0, message: 'Could not read that file.' });
        return;
      }

      // XHR (not fetch) so we get a real upload progress bar.
      await new Promise<void>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/sources/upload');
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUp({ phase: 'uploading', progress: Math.round((e.loaded / e.total) * 100) });
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUp({ phase: 'done', progress: 100 });
            onUploaded();
          } else {
            let msg = 'Upload failed. Please try again.';
            try {
              const body = JSON.parse(xhr.responseText) as { error?: string };
              if (body.error) msg = body.error;
            } catch {
              /* keep default */
            }
            setUp({ phase: 'error', progress: 0, message: msg });
          }
          resolve();
        };
        xhr.onerror = () => {
          setUp({ phase: 'error', progress: 0, message: 'Network error during upload.' });
          resolve();
        };
        xhr.send(JSON.stringify({ requestId: req.id, filename: file.name, contentBase64 }));
      });
    },
    [req.id, onUploaded]
  );

  const received = req.status === 'received' || up.phase === 'done';

  const border = highlighted
    ? `2px solid ${GREEN}`
    : received
      ? '1px solid rgba(63,122,52,0.4)'
      : '1px solid rgba(0,0,0,0.06)';

  return (
    <div
      ref={cardRef}
      id={req.id}
      style={{
        background: '#fff',
        borderRadius: 18,
        padding: 'clamp(18px, 2.4vw, 24px)',
        border,
        boxShadow: highlighted
          ? '0 10px 40px rgba(63,122,52,0.18)'
          : '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
        transition: 'box-shadow 0.3s, border-color 0.3s',
        scrollMarginTop: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <Chip>{req.id}</Chip>
        {received && (
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: GREEN_DK, background: 'rgba(63,122,52,0.12)', padding: '4px 10px', borderRadius: 100 }}>
            ✓ Received
          </span>
        )}
      </div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 1.9vw, 20px)', fontWeight: 400, color: INK, margin: '0 0 8px', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
        {req.title}
      </h3>

      {url ? (
        <a href={url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: GREEN_DK, textDecoration: 'none', borderBottom: '1.5px solid rgba(63,122,52,0.4)', paddingBottom: 1 }}>
          Get the document →
        </a>
      ) : (
        <span style={{ fontSize: 13, color: MUTE }}>No direct link — see the note below.</span>
      )}
      {helper && <p style={{ fontSize: 12, color: MUTE, lineHeight: 1.5, margin: '8px 0 0' }}>{helper}</p>}

      <p style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.7)', lineHeight: 1.55, margin: '12px 0 0' }}>
        <span style={{ fontWeight: 700, color: 'rgba(43,42,38,0.55)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Unblocks </span>
        {req.unblocks}
      </p>

      {/* Received state — awaiting the next refresh. */}
      {received && (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(63,122,52,0.06)', border: '1px dashed rgba(63,122,52,0.35)', borderRadius: 12, padding: '12px 14px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: GREEN_DK }}>Uploaded — awaiting next refresh</div>
            <div style={{ fontSize: 11.5, color: MUTE }}>
              {req.receivedAt ? `Received ${fmtDate(req.receivedAt)}. ` : ''}The 1st-of-month refresh will process it.
            </div>
          </div>
        </div>
      )}

      {/* Drop zone — only while the request is still open. */}
      {!received && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED.join(',')}
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void doUpload(f);
              e.target.value = '';
            }}
          />
          <div
            role="button"
            tabIndex={0}
            onClick={() => up.phase !== 'uploading' && up.phase !== 'reading' && inputRef.current?.click()}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && up.phase !== 'uploading') inputRef.current?.click();
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) void doUpload(f);
            }}
            style={{
              marginTop: 16,
              cursor: up.phase === 'uploading' || up.phase === 'reading' ? 'default' : 'pointer',
              border: `2px dashed ${dragOver ? GREEN : 'rgba(63,122,52,0.35)'}`,
              background: dragOver ? 'rgba(63,122,52,0.07)' : 'rgba(63,122,52,0.03)',
              borderRadius: 14,
              padding: '22px 16px',
              textAlign: 'center',
              transition: 'background 0.15s, border-color 0.15s',
            }}
          >
            {up.phase === 'uploading' || up.phase === 'reading' ? (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: GREEN_DK, marginBottom: 8 }}>
                  {up.phase === 'reading' ? 'Reading file…' : `Uploading… ${up.progress}%`}
                </div>
                <div style={{ height: 6, background: 'rgba(63,122,52,0.15)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${up.phase === 'reading' ? 8 : up.progress}%`, background: GREEN, borderRadius: 100, transition: 'width 0.2s' }} />
                </div>
              </div>
            ) : (
              <>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 6 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 9l5-5 5 5" /><path d="M12 4v12" /></svg>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>Drag the document here</div>
                <div style={{ fontSize: 11.5, color: MUTE, marginTop: 3 }}>or click to browse · {ALLOWED.join(' · ')} · up to 40MB</div>
              </>
            )}
          </div>
          {up.phase === 'error' && (
            <p style={{ fontSize: 12.5, color: '#b8341a', margin: '8px 0 0' }}>{up.message}</p>
          )}
        </>
      )}
    </div>
  );
}

/* ---- fulfilled (collapsed) ---------------------------------------- */

function FulfilledRow({ req, cardRef, highlighted }: { req: SourceRequest; cardRef?: (el: HTMLDivElement | null) => void; highlighted: boolean }) {
  return (
    <div
      ref={cardRef}
      id={req.id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: '#fff',
        borderRadius: 12,
        padding: '12px 16px',
        border: highlighted ? `2px solid ${GREEN}` : `1px solid ${HAIR}`,
        scrollMarginTop: 100,
      }}
    >
      <span style={{ fontSize: 16, color: GREEN }}>✓</span>
      <Chip>{req.id}</Chip>
      <span style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.75)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.title}</span>
      <span style={{ fontSize: 12, color: MUTE, whiteSpace: 'nowrap' }}>Fulfilled {fmtDate(req.fulfilledAt)}</span>
    </div>
  );
}

/* ---- login --------------------------------------------------------- */

function LoginScreen({ onSuccess, onNotConfigured }: { onSuccess: () => void; onNotConfigured: (msg: string) => void }) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/sources/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onSuccess();
        return;
      }
      if (res.status === 503) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        onNotConfigured(body.error ?? 'The sources app is not configured yet.');
        return;
      }
      setError(res.status === 401 ? 'Incorrect password.' : 'Something went wrong. Try again.');
    } catch {
      setError('Network error. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 20, padding: 'clamp(28px, 4vw, 40px)', boxShadow: '0 12px 48px rgba(0,0,0,0.08)' }}>
        <img src="/carelu-logo.svg" alt="Carelu" style={{ height: 26, width: 'auto', display: 'block', margin: '0 auto 22px', opacity: 0.9 }} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, color: INK, textAlign: 'center', margin: '0 0 6px', letterSpacing: '-0.01em' }}>Source Documents</h1>
        <p style={{ fontSize: 13.5, color: MUTE, textAlign: 'center', margin: '0 0 24px', lineHeight: 1.5 }}>Enter the team password to upload payer-source documents.</p>
        <input
          type="password"
          value={password}
          autoFocus
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Team password"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            padding: '13px 16px',
            borderRadius: 12,
            border: `1px solid ${error ? '#d97a6a' : 'rgba(43,42,38,0.18)'}`,
            outline: 'none',
            marginBottom: error ? 8 : 16,
          }}
        />
        {error && <p style={{ fontSize: 12.5, color: '#b8341a', margin: '0 0 16px' }}>{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          style={{
            width: '100%',
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            fontWeight: 600,
            color: '#fff',
            background: busy || !password ? 'rgba(63,122,52,0.5)' : GREEN,
            border: 'none',
            borderRadius: 100,
            padding: '13px 0',
            cursor: busy || !password ? 'default' : 'pointer',
          }}
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

/* ---- not-configured notice ---------------------------------------- */

function SetupNotice({ message }: { message: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 460, background: '#fff', borderRadius: 20, padding: 'clamp(28px, 4vw, 40px)', boxShadow: '0 12px 48px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <img src="/carelu-logo.svg" alt="Carelu" style={{ height: 24, width: 'auto', display: 'block', margin: '0 auto 20px', opacity: 0.9 }} />
        <div style={{ fontSize: 34, marginBottom: 8 }}>🛠️</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: INK, margin: '0 0 10px', letterSpacing: '-0.01em' }}>Almost ready</h1>
        <p style={{ fontSize: 14, color: MUTE, lineHeight: 1.6, margin: 0 }}>
          The Source Documents app is deployed but its environment variables aren’t set yet.
        </p>
        <p style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.5)', lineHeight: 1.55, margin: '14px 0 0', fontFamily: 'var(--font-mono, monospace)', background: 'rgba(63,122,52,0.06)', borderRadius: 10, padding: '10px 12px' }}>
          {message}
        </p>
        <p style={{ fontSize: 12.5, color: MUTE, lineHeight: 1.55, margin: '14px 0 0' }}>
          Once <code>SOURCES_PASSWORD</code>, <code>SOURCES_SESSION_SECRET</code>, and <code>GH_SOURCES_TOKEN</code> are set in Vercel, refresh this page.
        </p>
      </div>
    </div>
  );
}

/* ---- heartbeat strip ---------------------------------------------- */

function Heartbeat({ hb }: { hb: Heartbeat }) {
  const activityDays = daysSince(hb.lastPipelineActivity);
  const alive = activityDays !== null && activityDays < 8;
  const items = [
    { label: 'Last directory refresh', value: fmtDate(hb.lastDirectoryRefresh) },
    { label: 'Last pipeline activity', value: fmtDate(hb.lastPipelineActivity) },
    { label: 'Last repo commit', value: fmtDate(hb.lastSourcesCommit) },
    { label: 'Next scheduled refresh', value: hb.nextScheduledRefresh },
  ];
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${HAIR}`, padding: 'clamp(14px, 2vw, 20px)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: alive ? GREEN : 'rgba(43,42,38,0.3)' }} />
          {alive && <span className="src-pulse" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: GREEN }} />}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: alive ? GREEN_DK : MUTE }}>
          {alive ? 'Pipeline healthy' : 'Pipeline idle'}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
        {items.map((it) => (
          <div key={it.label}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.45)', marginBottom: 3 }}>{it.label}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{it.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        {([['Open', hb.counts.open, '#b8741a'], ['Received', hb.counts.received, GREEN], ['Fulfilled', hb.counts.fulfilled, GREEN_DK]] as const).map(([label, n, color]) => (
          <span key={label} style={{ fontSize: 12, fontWeight: 600, color, background: 'rgba(63,122,52,0.06)', border: `1px solid ${HAIR}`, borderRadius: 100, padding: '5px 12px' }}>
            {n} {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---- history panel ------------------------------------------------- */

function History({ events }: { events: SourceEvent[] }) {
  if (events.length === 0) return null;
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${HAIR}`, padding: 'clamp(16px, 2.2vw, 22px)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 400, color: INK, margin: '0 0 14px', letterSpacing: '-0.01em' }}>History</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {events.map((ev, i) => {
          const meta = EVENT_META[ev.type] ?? EVENT_META['request-opened'];
          return (
            <div key={ev.ts + i} style={{ display: 'flex', gap: 10, padding: '9px 0', borderTop: i === 0 ? 'none' : `1px solid ${HAIR}` }}>
              <span style={{ fontSize: 15, lineHeight: '20px' }}>{meta.icon}</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.8)', lineHeight: 1.45 }}>
                  <span style={{ fontWeight: 700, color: meta.color }}>{meta.label}</span>
                  {ev.summary ? <span> — {ev.summary}</span> : null}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(43,42,38,0.45)', marginTop: 2 }}>{fmtDate(ev.ts)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */

export default function SourcesApp() {
  useSeo({ title: 'Source Documents · Carelu', description: 'Carelu payer-source document upload.', noindex: true });

  const [view, setView] = useState<'loading' | 'login' | 'ready' | 'notConfigured'>('loading');
  const [notConfiguredMsg, setNotConfiguredMsg] = useState('');
  const [data, setData] = useState<StatePayload | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Fetch state; returns the outcome so callers can react.
  const loadState = useCallback(async (): Promise<'ready' | 'login' | 'notConfigured' | 'error'> => {
    try {
      const res = await fetch('/api/sources/state', { headers: { accept: 'application/json' } });
      if (res.status === 401) return 'login';
      if (res.status === 503) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setNotConfiguredMsg(body.error ?? 'not configured');
        return 'notConfigured';
      }
      if (!res.ok) return 'error';
      setData((await res.json()) as StatePayload);
      return 'ready';
    } catch {
      return 'error';
    }
  }, []);

  // Initial load.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const outcome = await loadState();
      if (cancelled) return;
      if (outcome === 'ready') setView('ready');
      else if (outcome === 'login') setView('login');
      else if (outcome === 'notConfigured') setView('notConfigured');
      else setView('login'); // treat transient errors as "please sign in"
    })();
    return () => { cancelled = true; };
  }, [loadState]);

  // Poll every 60s while signed in.
  useEffect(() => {
    if (view !== 'ready') return;
    const id = setInterval(() => {
      void (async () => {
        const outcome = await loadState();
        if (outcome === 'login') setView('login');
        else if (outcome === 'notConfigured') setView('notConfigured');
      })();
    }, 60_000);
    return () => clearInterval(id);
  }, [view, loadState]);

  // Deep link: /sources#REQ-001 scrolls to + highlights that card once data loads.
  useEffect(() => {
    if (view !== 'ready' || !data) return;
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const el = cardRefs.current[hash];
    if (el) {
      setHighlightId(hash);
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const t = setTimeout(() => setHighlightId(null), 2600);
      return () => clearTimeout(t);
    }
  }, [view, data]);

  async function refresh() {
    await loadState();
  }

  async function logout() {
    await fetch('/api/sources/logout', { method: 'POST' }).catch(() => {});
    setData(null);
    setView('login');
  }

  if (view === 'loading') {
    return (
      <div style={{ background: BONE, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, color: MUTE, letterSpacing: '0.04em' }}>Loading…</span>
      </div>
    );
  }

  const shell = (children: React.ReactNode) => (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <style>{`
        @keyframes srcPulse { 0% { transform: scale(1); opacity: 0.6; } 70%, 100% { transform: scale(2.6); opacity: 0; } }
        .src-pulse { animation: srcPulse 1.8s ease-out infinite; }
      `}</style>
      {children}
    </div>
  );

  if (view === 'notConfigured') return shell(<SetupNotice message={notConfiguredMsg} />);

  if (view === 'login') {
    return shell(
      <LoginScreen
        onSuccess={async () => {
          const outcome = await loadState();
          if (outcome === 'ready') setView('ready');
          else if (outcome === 'notConfigured') setView('notConfigured');
        }}
        onNotConfigured={(msg) => { setNotConfiguredMsg(msg); setView('notConfigured'); }}
      />
    );
  }

  // ready
  const requests = data?.requests ?? [];
  const sorted = [...requests].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.id.localeCompare(b.id));
  const active = sorted.filter((r) => r.status !== 'fulfilled');
  const fulfilled = sorted.filter((r) => r.status === 'fulfilled');

  return shell(
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(24px, 4vw, 48px) clamp(16px, 4vw, 40px) 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/carelu-logo.svg" alt="Carelu" style={{ height: 24, width: 'auto', display: 'block', opacity: 0.9 }} />
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 400, color: INK, margin: 0, letterSpacing: '-0.015em' }}>Source Documents</h1>
            <p style={{ fontSize: 12.5, color: MUTE, margin: '2px 0 0' }}>Upload the payer/state documents the pipeline can’t fetch on its own.</p>
          </div>
        </div>
        <button onClick={logout} style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, color: MUTE, background: 'transparent', border: `1px solid ${HAIR}`, borderRadius: 100, padding: '8px 16px', cursor: 'pointer' }}>Sign out</button>
      </div>

      {data && <Heartbeat hb={data.heartbeat} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24, marginTop: 24 }}>
        <div className="src-main-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 24, alignItems: 'start' }}>
          {/* Requests column */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.45)', margin: '0 0 12px' }}>
              Open & received requests
            </div>
            {active.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${HAIR}`, padding: 24, fontSize: 13.5, color: MUTE }}>
                No open requests right now — every document has been received. 🎉
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {active.map((req) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    highlighted={highlightId === req.id}
                    cardRef={(el) => { cardRefs.current[req.id] = el; }}
                    onUploaded={refresh}
                  />
                ))}
              </div>
            )}

            {fulfilled.length > 0 && (
              <div style={{ marginTop: 26 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.45)', margin: '0 0 12px' }}>
                  Fulfilled
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {fulfilled.map((req) => (
                    <FulfilledRow key={req.id} req={req} highlighted={highlightId === req.id} cardRef={(el) => { cardRefs.current[req.id] = el; }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* History column */}
          <div style={{ position: 'sticky', top: 24 }}>{data && <History events={data.events} />}</div>
        </div>
      </div>

      <style>{`@media (max-width: 780px) { .src-main-grid { grid-template-columns: minmax(0,1fr) !important; } .src-main-grid > div:last-child { position: static !important; } }`}</style>
    </div>
  );
}
