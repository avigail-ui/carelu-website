/**
 * Chaos-tabs animation — ARCHIVED from earlier session.
 * Not currently used in the active Landing page; kept here in case we want
 * to re-introduce it later.
 *
 * To use:
 *   1. In Landing.tsx, import { ChaosTabsAnimation } from
 *      '../components/_archive/ChaosTabsAnimation'
 *   2. Render <ChaosTabsAnimation /> wherever you want it
 *
 * Depends on CSS classes / keyframes in src/index.css (.rv, .rv-scale, etc.)
 */
import { useState, useEffect, useRef } from 'react';

export function ChaosTabsAnimation() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackH = rect.height - window.innerHeight;
      if (trackH <= 0) return;
      const raw = -rect.top / trackH;
      // Scale t so the chaos animation (which uses thresholds up to 0.62) fills the full
      // section scroll. No dead t-range after close → no visible white tail.
      setT(Math.max(0, Math.min(0.62, raw * 0.62)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Browser tabs representing chaos — overwhelming amount
  const tabs = [
    'Monday.com', 'DocuSign', 'IntakeQ', 'Gmail', 'Google Voice',
    'eFax', 'Outlook', 'Scheduling', 'Insurance...', 'Sheets',
    'Slack', 'RingCentral', 'Jotform', 'HiMama', 'CentralReach',
    'Calendly', 'Zoho CRM', 'Fax Queue', 'Voicemail', 'Forms',
    'Typeform', 'WhatsApp', 'Teams', 'Notion', 'Airtable',
  ];
  // Phase 1: t=0→0.08 — just text (very brief)
  // Phase 2: t=0.08→0.2 — browser + desktop chaos slides up covering text
  // Phase 3: t=0.2→0.55 — chaos shown, cursor moves to X
  // Phase 4: t=0.55 — click, close, green + solution

  // Browser enters from bottom-right, slides up to center
  const browserVisible = t > 0.05;
  const enterProgress = t < 0.06 ? 0 : Math.min(1, (t - 0.06) / 0.08);
  const enterEase = 1 - Math.pow(1 - enterProgress, 3);
  const browserX = (1 - enterEase) * 50; // slides from right
  const browserY = (1 - enterEase) * 60; // slides from bottom

  // Cursor: appears at t=0.3, reaches X at t=0.5
  const cursorProgress = t < 0.3 ? 0 : Math.min(1, (t - 0.3) / 0.2);
  const ce = cursorProgress < 0.5 ? 2 * cursorProgress * cursorProgress : 1 - Math.pow(-2 * cursorProgress + 2, 2) / 2;
  const cursorX = 55 - ce * 52.5;
  const cursorY = 65 - ce * 62.5;

  // Close at t=0.55
  const closed = t >= 0.62;
  const closing = t > 0.55 && !closed;
  const closeScale = closing ? Math.max(0, 1 - (t - 0.55) * 14) : 1;

  // Background scattered windows — extra chaos around the main browser

  return (
    <div ref={trackRef} style={{ height: '260vh', position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}>

        {/* Text -- centered above browser */}
        <div style={{
          textAlign: 'center', position: 'relative', zIndex: 2,
          padding: '0 36px', marginBottom: 32, width: '100%',
        }}>
          {/* Problem text — always visible behind browser, fades when green bg appears */}
          <div style={{ opacity: t > 0.55 ? 0 : 1, transition: 'opacity 0.3s', position: 'absolute', inset: 0 }}>
              <span style={{
                display: 'inline-block', fontSize: 11, fontWeight: 600,
                textTransform: 'uppercase' as const, letterSpacing: '0.1em',
                color: '#999', marginBottom: 20,
              }}>
                What's actually happening
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)',
                fontWeight: 400, lineHeight: 1.12, color: '#000', maxWidth: 640, margin: '0 auto 16px',
              }}>
                You're juggling multiple systems for inquiries, forms, insurance, and scheduling.
              </h2>
              <p style={{ fontSize: 17, color: '#666', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
                Creating a messy intake process that loses families before they ever get to care.
              </p>
            </div>
          {/* Spacer for layout height — must match the bigger hero-style solution h2 */}
          <div style={{ visibility: 'hidden' }}>
            <span style={{ display: 'inline-block', fontSize: 12, marginBottom: 28, padding: '8px 22px' }}>&nbsp;</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 400, lineHeight: 1.06, letterSpacing: '-1.6px', maxWidth: 720, margin: '0 auto 20px' }}>&nbsp;<br />&nbsp;</h2>
            <p style={{ fontSize: 'clamp(15px, 1.55vw, 18px)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>&nbsp;</p>
          </div>
        </div>

        {/* Desktop chaos -- slides up, covers text, then closes */}
        {browserVisible && !closed && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `translate(${browserX}%, ${browserY}%) scale(${closeScale})`,
          opacity: closeScale,
          transformOrigin: 'top left',
          transition: closing ? 'transform 0.15s, opacity 0.15s' : 'transform 0.2s ease-out',
          padding: '3vh 2%',
        }}>
        {/* Main browser -- centered */}
        <div style={{ width: '100%', maxWidth: 720, position: 'relative', zIndex: 5, margin: '0 auto' }}>
          <div style={{
            background: '#f0f0f0', borderRadius: 12, overflow: 'hidden',
            boxShadow: '0 16px 80px rgba(0,0,0,0.18)', border: '1px solid #ccc',
          }}>
            {/* Title bar -- placeholder spacing; visible overlay rendered below at high zIndex */}
            <div style={{ height: 34, background: '#e4e4e4' }} />
            {/* Tab bar -- overflowing */}
            <div style={{ display: 'flex', background: '#d8d8d8', overflow: 'hidden', height: 34 }}>
              {tabs.map((tab, i) => (
                <div key={i} style={{
                  flex: '0 0 auto', padding: '7px 12px', fontSize: 10, fontWeight: 500,
                  color: '#555', background: i === 0 ? '#f5f5f5' : '#e0e0e0',
                  borderRight: '1px solid #c8c8c8', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  {tab}
                  <span style={{ fontSize: 8, color: '#aaa' }}>x</span>
                </div>
              ))}
            </div>
            {/* Content -- more windows, more square */}
            <div style={{ position: 'relative', height: 340, background: '#f5f5f5', overflow: 'hidden' }}>
              {/* DocuSign -- signature UI */}
              <div style={{ position: 'absolute', left: 5, top: 5, width: 220, height: 195, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#333' }}>DocuSign</div>
                <div style={{ padding: 10 }}>
                  <div style={{ height: 6, background: '#eee', borderRadius: 3, width: '80%', marginBottom: 8 }} />
                  <div style={{ height: 6, background: '#eee', borderRadius: 3, width: '60%', marginBottom: 12 }} />
                  <div style={{ border: '1.5px dashed #ccc', borderRadius: 4, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#bbb', marginBottom: 10 }}>Sign here</div>
                  <div style={{ background: '#4898D1', borderRadius: 4, padding: '5px 0', textAlign: 'center', fontSize: 9, color: '#fff', fontWeight: 600 }}>SIGN</div>
                </div>
              </div>

              {/* Gmail -- email list */}
              <div style={{ position: 'absolute', left: 190, top: 15, width: 240, height: 205, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#c5221f' }}>Gmail - 47 unread</div>
                <div style={{ padding: 0 }}>
                  {['Re: Insurance card needed', 'Fwd: Missing diagnosis report', 'URGENT: Parent callback', 'Intake form - Jake M.'].map((e, j) => (
                    <div key={j} style={{ padding: '7px 10px', borderBottom: '1px solid #f5f5f5', fontSize: 9, color: j < 2 ? '#000' : '#666', fontWeight: j < 2 ? 600 : 400, display: 'flex', gap: 6 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: j < 2 ? '#c5221f' : 'transparent', flexShrink: 0, marginTop: 2 }} />
                      {e}
                    </div>
                  ))}
                </div>
              </div>

              {/* Monday.com -- kanban board */}
              <div style={{ position: 'absolute', left: 380, top: 8, width: 230, height: 200, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#ff3d57' }}>Monday.com</div>
                <div style={{ display: 'flex', gap: 4, padding: 6 }}>
                  {[{ label: 'New', n: 12, c: '#579bfc' }, { label: 'Stuck', n: 14, c: '#e2445c' }, { label: 'Done', n: 3, c: '#00c875' }].map((col, j) => (
                    <div key={j} style={{ flex: 1 }}>
                      <div style={{ fontSize: 8, fontWeight: 600, color: col.c, marginBottom: 4 }}>{col.label} ({col.n})</div>
                      {[0, 1, 2].map(k => (
                        <div key={k} style={{ height: 14, background: '#f5f5f5', borderRadius: 3, marginBottom: 3, borderLeft: `3px solid ${col.c}` }} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* IntakeQ -- form */}
              <div style={{ position: 'absolute', left: 70, top: 90, width: 200, height: 185, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#2d9cdb' }}>IntakeQ</div>
                <div style={{ padding: 8 }}>
                  {['Patient Name', 'Date of Birth', 'Insurance ID', 'Diagnosis'].map((f, j) => (
                    <div key={j} style={{ marginBottom: 6 }}>
                      <div style={{ fontSize: 7, color: '#999', marginBottom: 2 }}>{f}</div>
                      <div style={{ height: 14, background: j === 3 ? '#fff3f3' : '#f8f8f8', borderRadius: 3, border: `1px solid ${j === 3 ? '#e88' : '#eee'}` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* eFax */}
              <div style={{ position: 'absolute', left: 310, top: 110, width: 195, height: 175, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#666' }}>eFax - 3 incoming</div>
                <div style={{ padding: 8 }}>
                  {['Dr. Patel - 6 pages', 'Pediatrics referral', 'Insurance auth'].map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: 9, color: '#555' }}>
                      <div style={{ width: 16, height: 20, background: '#f0f0f0', borderRadius: 2, border: '1px solid #ddd', flexShrink: 0 }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Sheets -- spreadsheet */}
              <div style={{ position: 'absolute', left: 25, top: 160, width: 210, height: 170, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#0f9d58' }}>Google Sheets</div>
                <div style={{ padding: 4 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
                    {['Name', 'Status', 'Ins.', 'Jake M.', 'Pending', '---', 'Sarah T.', 'Missing', '---', 'Ryan K.', 'Called', 'Yes'].map((cell, j) => (
                      <div key={j} style={{ fontSize: 7, padding: '3px 4px', background: j < 3 ? '#f0f0f0' : '#fff', border: '1px solid #eee', color: cell === '---' ? '#ddd' : cell === 'Missing' ? '#c00' : '#555', fontWeight: j < 3 ? 600 : 400 }}>{cell}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calendly */}
              <div style={{ position: 'absolute', left: 510, top: 40, width: 195, height: 185, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#006BFF' }}>Calendly</div>
                <div style={{ padding: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
                    {Array.from({ length: 21 }, (_, j) => (
                      <div key={j} style={{ height: 12, borderRadius: 2, background: j === 8 || j === 15 ? '#006BFF' : '#f5f5f5', fontSize: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: j === 8 || j === 15 ? '#fff' : '#bbb' }}>{j + 1}</div>
                    ))}
                  </div>
                  <div style={{ fontSize: 8, color: '#999' }}>Next slot: 2 weeks out</div>
                  <div style={{ fontSize: 8, color: '#c00', marginTop: 3 }}>Waitlist: 9 families</div>
                </div>
              </div>

              {/* RingCentral */}
              <div style={{ position: 'absolute', left: 460, top: 150, width: 210, height: 170, background: '#fff', borderRadius: 6, border: '1px solid #ddd', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#f80' }}>RingCentral</div>
                <div style={{ padding: 8 }}>
                  {[{ label: 'Missed calls', val: '7', c: '#c00' }, { label: 'Voicemails', val: '4 new', c: '#f80' }, { label: 'Avg hold', val: '8 min', c: '#999' }].map((s, j) => (
                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: 9 }}>
                      <span style={{ color: '#666' }}>{s.label}</span>
                      <span style={{ color: s.c, fontWeight: 600 }}>{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scattered app windows — all uniform size, each with real, lived-in content */}
          {[
            { name: 'Slack — #intake-team', left: '-15%', top: '8%', content: (
              <div style={{ padding: 8 }}>
                {[
                  { u: 'sarah', m: 'did anyone call Thompson back??', t: '2:14' },
                  { u: 'mike', m: 'i thought rachel had it', t: '2:16' },
                  { u: 'rachel', m: 'which one — i have 6 pending', t: '2:18' },
                ].map((msg, j) => (
                  <div key={j} style={{ marginBottom: 7 }}>
                    <div style={{ fontSize: 8, color: '#999' }}><span style={{ fontWeight: 700, color: '#333' }}>@{msg.u}</span> · {msg.t}</div>
                    <div style={{ fontSize: 9, color: '#444', marginTop: 1 }}>{msg.m}</div>
                  </div>
                ))}
              </div>
            )},
            { name: 'WhatsApp Web', left: '70%', top: '-10%', content: (
              <div style={{ padding: '6px 8px' }}>
                <div style={{ fontSize: 8, color: '#555', marginBottom: 5, display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 600 }}>Mom (Jake T.)</span><span style={{ color: '#25d366' }}>online</span></div>
                {['is my son on the waitlist?', 'hello??', 'i called twice yesterday', 'should i try another clinic?'].map((m, j) => (
                  <div key={j} style={{ background: '#dcf8c6', borderRadius: 6, padding: '3px 7px', fontSize: 9, color: '#333', marginBottom: 3, maxWidth: '88%', marginLeft: 'auto' }}>{m}</div>
                ))}
              </div>
            )},
            { name: 'Microsoft Teams', left: '85%', top: '40%', content: (
              <div style={{ padding: 8 }}>
                <div style={{ fontSize: 8, color: '#999', marginBottom: 6 }}>Intake Standup · 3 people</div>
                {[
                  { l: '23 families in pipeline', red: false },
                  { l: '7 missing insurance cards', red: false },
                  { l: '4 awaiting diagnosis', red: true },
                  { l: '11 no follow-up 5+ days', red: true },
                ].map((row, j) => (
                  <div key={j} style={{ fontSize: 9, color: row.red ? '#c00' : '#555', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 4, height: 4, background: row.red ? '#c00' : '#aaa', borderRadius: 999, flexShrink: 0 }} />
                    {row.l}
                  </div>
                ))}
              </div>
            )},
            { name: 'Outlook — Calendar', left: '-15%', top: '60%', content: (
              <div style={{ padding: '6px 8px' }}>
                <div style={{ fontSize: 8, color: '#999', marginBottom: 5 }}>Today · Tue Mar 12</div>
                {[
                  { t: '9:00', l: 'Parent callback (overdue)', c: '#c00' },
                  { t: '10:30', l: 'Insurance follow-up x3', c: '#4A7C3F' },
                  { t: '1:00', l: 'DocuSign reminders', c: '#4A7C3F' },
                  { t: '2:30', l: 'Fax Dr. Patel AGAIN', c: '#f80' },
                ].map((e, j) => (
                  <div key={j} style={{ fontSize: 9, padding: '3px 6px', borderLeft: `3px solid ${e.c}`, marginBottom: 3, color: '#444', display: 'flex', gap: 6 }}>
                    <span style={{ color: '#888', fontWeight: 600, minWidth: 24 }}>{e.t}</span>{e.l}
                  </div>
                ))}
              </div>
            )},
            { name: 'Notion — SOPs', left: '48%', top: '70%', content: (
              <div style={{ padding: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#333', marginBottom: 3 }}>Intake Process v4.2</div>
                <div style={{ fontSize: 8, color: '#999', marginBottom: 6 }}>Edited by Sarah · 3 months ago</div>
                <div style={{ fontSize: 8.5, color: '#555', lineHeight: 1.4, marginBottom: 3 }}>1. Receive inquiry — any channel</div>
                <div style={{ fontSize: 8.5, color: '#555', lineHeight: 1.4, marginBottom: 3 }}>2. Log in CRM within 24h</div>
                <div style={{ fontSize: 8.5, color: '#555', lineHeight: 1.4, marginBottom: 3 }}>3. Send forms via DocuSign...</div>
                <div style={{ fontSize: 8, color: '#c00', marginTop: 3, fontStyle: 'italic' as const }}>// nobody follows this anymore</div>
              </div>
            )},
            { name: 'Google Forms', left: '35%', top: '-10%', content: (
              <div style={{ padding: '6px 8px' }}>
                <div style={{ fontSize: 8, color: '#673AB7', fontWeight: 600, marginBottom: 5 }}>Patient Intake — response #18</div>
                {[
                  { l: 'Child name', v: 'Jake M.', err: false },
                  { l: 'DOB', v: '', err: true },
                  { l: 'Insurance #', v: 'Aetna — pending', err: false },
                  { l: 'Primary concern', v: '', err: true },
                ].map((f, j) => (
                  <div key={j} style={{ marginBottom: 4 }}>
                    <div style={{ fontSize: 7, color: '#666', marginBottom: 1 }}>{f.l}{f.err && <span style={{ color: '#c00' }}> *</span>}</div>
                    <div style={{ height: 12, background: '#fff', borderRadius: 2, border: `1px solid ${f.err ? '#fbb' : '#e0e0e0'}`, padding: '0 4px', fontSize: 7.5, color: '#444', display: 'flex', alignItems: 'center' }}>{f.v}</div>
                  </div>
                ))}
              </div>
            )},
            { name: 'eFax — incoming', left: '62%', top: '-10%', content: (
              <div style={{ padding: 6 }}>
                <div style={{ fontSize: 8, color: '#c00', marginBottom: 5, fontWeight: 600 }}>3 unread · 4 in queue</div>
                {[
                  { from: 'Dr. Patel', sub: '6p · referral', urgent: true },
                  { from: 'Pediatrics Grp', sub: '3p · auth' },
                  { from: 'Aetna', sub: '11p · denial' },
                  { from: 'Unknown', sub: '1p · ??' },
                ].map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 0', borderBottom: '1px solid #f3f3f3' }}>
                    <div style={{ width: 12, height: 14, background: '#f3f3f3', borderRadius: 1, border: `1px solid ${f.urgent ? '#c00' : '#ddd'}`, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 8.5, color: f.urgent ? '#c00' : '#555', fontWeight: f.urgent ? 600 : 400 }}>{f.from}</div>
                      <div style={{ fontSize: 7, color: '#999' }}>{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            )},
            { name: 'Phone Log', left: '65%', top: '70%', content: (
              <div style={{ padding: 6 }}>
                <div style={{ fontSize: 8, color: '#999', marginBottom: 5 }}>Today · 7 missed</div>
                {[
                  { n: 'Unknown · 555-2104', t: '11:55', miss: true },
                  { n: 'Sarah T. (mom)', t: '11:47', miss: true },
                  { n: 'VM · 555-8821', t: '10:14', miss: false },
                  { n: 'Dr. Patel office', t: '9:02', miss: false },
                ].map((c, j) => (
                  <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f3f3f3' }}>
                    <span style={{ fontSize: 8.5, color: c.miss ? '#c00' : '#555', fontWeight: c.miss ? 600 : 400 }}>{c.n}</span>
                    <span style={{ fontSize: 7, color: '#999' }}>{c.t}</span>
                  </div>
                ))}
              </div>
            )},
          ].map((win, i) => (
            <div key={`stack${i}`} style={{
              position: 'absolute', left: win.left, top: win.top, width: 180, height: 150,
              background: '#fff', borderRadius: 8, border: '1px solid #ddd',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              zIndex: 4, overflow: 'hidden',
            }}>
              <div style={{ padding: '6px 10px', borderBottom: '1px solid #eee', fontSize: 10, fontWeight: 600, color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f8f8' }}>
                {win.name}
                <span style={{ color: '#ccc', fontSize: 9 }}>x</span>
              </div>
              {win.content}
            </div>
          ))}

          {/* Mouse cursor -- BIG */}
          {t > 0.25 && (
            <div style={{
              position: 'absolute',
              left: `${cursorX}%`, top: `${cursorY}%`,
              transition: 'left 0.08s ease-out, top 0.08s ease-out',
              zIndex: 10, pointerEvents: 'none',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))',
            }}>
              <svg width="40" height="48" viewBox="0 0 20 24" fill="none">
                <path d="M1 1L1 18L6 13L11 22L14 20L9 12L16 12L1 1Z" fill="#000" stroke="#fff" strokeWidth="1" />
              </svg>
            </div>
          )}

          {/* Title bar overlay -- sits above the shell but BELOW scattered windows, so small windows render on top */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            display: 'flex', alignItems: 'center', padding: '10px 16px',
            background: '#e4e4e4', gap: 10, zIndex: 1,
            borderRadius: '12px 12px 0 0',
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                background: t > 0.48 ? '#ff3b30' : '#ff5f57',
                boxShadow: t > 0.48 ? '0 0 16px rgba(255,59,48,0.7)' : 'none',
                transform: t > 0.48 ? 'scale(1.5)' : 'scale(1)',
                transition: 'all 0.15s',
              }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#28c840' }} />
            </div>
          </div>
        </div>
        </div>
        )}

        {/* Channel ring — removed, now in HowCarelu section */}
        {false && t > 0.82 && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: t > 0.85 ? 1 : (t - 0.82) * 33,
            transition: 'opacity 0.2s',
          }}>
            <div style={{ position: 'relative', width: 320, height: 320 }}>
              {/* Ring line */}
              <svg viewBox="0 0 320 320" style={{ position: 'absolute', inset: 0 }}>
                <circle cx="160" cy="160" r="130" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              </svg>

              {/* Center */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>ALL</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>CHANNELS</div>
              </div>

              {/* Channel nodes */}
              {['Phone', 'Text', 'Chat', 'Forms', 'Fax', 'Email'].map((ch, i, arr) => {
                const angle = (-90 + (i / arr.length) * 360) * (Math.PI / 180);
                const x = 160 + Math.cos(angle) * 130;
                const y = 160 + Math.sin(angle) * 130;
                const threshold = 0.86 + i * 0.015;
                const visible = t > threshold;

                return (
                  <div key={ch} style={{
                    position: 'absolute',
                    left: x - 28, top: y - 28,
                    width: 56, height: 56, borderRadius: '50%',
                    background: visible ? 'rgba(74,124,63,0.9)' : 'rgba(255,255,255,0.06)',
                    border: visible ? '2px solid rgba(138,200,120,0.6)' : '2px solid rgba(255,255,255,0.1)',
                    boxShadow: visible ? '0 0 24px rgba(74,124,63,0.5)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: visible ? 'scale(1)' : 'scale(0.7)',
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: visible ? '#fff' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s' }}>{ch}</span>
                  </div>
                );
              })}

              {/* Connecting lines */}
              <svg viewBox="0 0 320 320" style={{ position: 'absolute', inset: 0 }}>
                {['Phone', 'Text', 'Chat', 'Forms', 'Fax', 'Email'].map((_, i, arr) => {
                  const angle = (-90 + (i / arr.length) * 360) * (Math.PI / 180);
                  const x = 160 + Math.cos(angle) * 130;
                  const y = 160 + Math.sin(angle) * 130;
                  return <line key={i} x1="160" y1="160" x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />;
                })}
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
