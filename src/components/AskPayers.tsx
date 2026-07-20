import { useRef, useState } from 'react';

/* ================================================================
   Ask-the-directory chat (/payers hero). Streams grounded answers
   from /api/ask, which retrieves from the payer-guide corpus and
   cites primary sources. Replaces the old keyword search bar.
   ================================================================ */

const INK = '#1A1A1A';
const GREEN = '#3f7a34';
const GREEN_DKC = '#2e5a26';

type Msg = { role: 'user' | 'assistant'; content: string };

const SUGGESTIONS = [
  'Does Cigna require prior auth for the assessment?',
  'What does NC Medicaid pay for 97153?',
  'Is an autism diagnosis required in Colorado?',
  'How often does Optum reauthorize ABA?',
];

// Minimal, safe markdown: escape everything, then re-introduce links + bold.
function renderAnswer(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/payers\/[a-z0-9-]+)\)/g, (_m, label, url) => {
      const external = url.startsWith('http');
      return `<a href="${url}"${external ? ' target="_blank" rel="noreferrer"' : ''} style="color:${GREEN_DKC};font-weight:600;">${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

export default function AskPayers() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    setInput('');
    setBusy(true);
    const next: Msg[] = [...messages, { role: 'user', content: q }, { role: 'assistant', content: '' }];
    setMessages(next);

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(0, -1) }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        throw new Error(`status ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const snapshot = acc;
        setMessages((cur) => {
          const copy = [...cur];
          copy[copy.length - 1] = { role: 'assistant', content: snapshot };
          return copy;
        });
      }
    } catch {
      setMessages((cur) => {
        const copy = [...cur];
        copy[copy.length - 1] = {
          role: 'assistant',
          content: copy[copy.length - 1]?.content ||
            'Sorry — the assistant is unavailable right now. Browse the guides below, or try again in a minute.',
        };
        return copy;
      });
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="rv" style={{
      background: '#fff', borderRadius: 20, border: '1px solid rgba(63,122,52,0.25)',
      boxShadow: '0 8px 32px rgba(46,90,38,0.1)', padding: 'clamp(16px, 2.4vw, 24px)',
      textAlign: 'left',
    }}>
      {messages.length === 0 && (
        <p style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.62)', lineHeight: 1.6, margin: '0 0 12px' }}>
          Ask anything about the payers in our directory — prior auth, diagnosis requirements, rates,
          reauthorization. Answers come only from our verified guides, with sources cited.
        </p>
      )}

      {messages.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
          {messages.map((m, i) => (
            m.role === 'user' ? (
              <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '85%', background: 'rgba(63,122,52,0.09)', color: INK, borderRadius: '14px 14px 4px 14px', padding: '10px 15px', fontSize: 14, lineHeight: 1.55 }}>
                {m.content}
              </div>
            ) : (
              <div key={i} style={{ alignSelf: 'flex-start', maxWidth: '95%', fontSize: 14, lineHeight: 1.68, color: 'rgba(43,42,38,0.82)' }}>
                {m.content
                  ? <span dangerouslySetInnerHTML={{ __html: renderAnswer(m.content) }} />
                  : <span style={{ color: 'rgba(43,42,38,0.45)' }}>Checking the guides…</span>}
              </div>
            )
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); ask(input); }}
        style={{ display: 'flex', gap: 8 }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={messages.length === 0 ? 'e.g. Does Aetna require prior auth for an ABA assessment?' : 'Ask a follow-up…'}
          aria-label="Ask about a payer"
          maxLength={1000}
          style={{
            flex: 1, boxSizing: 'border-box', fontFamily: 'var(--font-body)', fontSize: 15,
            color: INK, background: '#FAF8F3', border: '1px solid rgba(43,42,38,0.14)', borderRadius: 100,
            padding: '13px 20px', outline: 'none',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = GREEN; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(43,42,38,0.14)'; }}
        />
        <button type="submit" disabled={busy || input.trim().length === 0} style={{
          fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, cursor: busy ? 'default' : 'pointer',
          color: '#fff', background: busy ? 'rgba(63,122,52,0.5)' : GREEN, border: 'none',
          borderRadius: 100, padding: '0 22px', flexShrink: 0,
        }}>
          {busy ? '…' : 'Ask'}
        </button>
      </form>

      {messages.length === 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => ask(s)} disabled={busy} style={{
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              color: 'rgba(43,42,38,0.65)', background: 'rgba(43,42,38,0.05)',
              border: '1px solid rgba(43,42,38,0.08)', borderRadius: 100, padding: '6px 13px',
            }}>{s}</button>
          ))}
        </div>
      )}

      <p style={{ fontSize: 11, color: 'rgba(43,42,38,0.45)', lineHeight: 1.5, margin: '10px 0 0' }}>
        AI-generated from Carelu's payer guides — verify against the payer's live policy for any specific member. Not billing, legal, or clinical advice.
      </p>
    </div>
  );
}
