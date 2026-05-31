import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const W: React.CSSProperties = { maxWidth: 1160, margin: '0 auto', padding: '0 28px' };

/* live "families admitted" counter — mirrors the homepage */
const BASELINE_DATE = new Date('2026-04-16T00:00:00Z').getTime();
const BASELINE_COUNT = 35000;
const GROWTH_PER_MS = 500 / (24 * 60 * 60 * 1000);
function getLiveCount() {
  return Math.floor(BASELINE_COUNT + Math.max(0, Date.now() - BASELINE_DATE) * GROWTH_PER_MS);
}

/* NOTE: placeholder team — swap names, roles, bios, credentials, and photos for the real people. */
type Member = { name: string; role: string; bio: string; creds: string[]; photo: string };
const TEAM: Member[] = [
  { name: 'Jordan Reyes', role: 'Founder & CEO', bio: 'Builds vertical AI companies. Previously led growth at a fintech from seed to Series C.', creds: ['Wharton', 'ex-Stripe'], photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=720&fit=crop&crop=faces' },
  { name: 'Maya Chen', role: 'Engineering', bio: 'Architects the systems that capture and complete every intake — reliable infrastructure at scale.', creds: ['MIT', 'ex-Google'], photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=720&fit=crop&crop=faces' },
  { name: 'Daniel Osei', role: 'Product', bio: 'Turns messy real-world workflows into software that does the work. Shipped products used by millions.', creds: ['Stanford', 'ex-Ramp'], photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=720&fit=crop&crop=faces' },
  { name: 'Priya Nair', role: 'AI & Models', bio: 'Leads the agentic models behind Carelu — qualification, follow-up, and document understanding.', creds: ['CMU', 'ex-OpenAI'], photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=720&fit=crop&crop=faces' },
  { name: 'Sam Whitfield', role: 'Growth', bio: 'Owns go-to-market. Built outbound and partnership engines at fast-growing B2B startups.', creds: ['Columbia', 'ex-Toast'], photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=720&fit=crop&crop=faces' },
  { name: 'Elena Vasquez', role: 'Operations', bio: 'Runs delivery and customer success — making sure every provider is live and winning fast.', creds: ['Penn', 'ex-Flatiron Health'], photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=720&fit=crop&crop=faces' },
];

const STATS = [
  { v: '85%', l: 'Family completion rate', s: 'Industry average is under 30%.' },
  { v: '3×', l: 'More families admitted', s: 'Same team, same hours.' },
  { v: '<10 min', l: 'First contact to intake-ready', s: 'What used to take days.' },
];

const VALUES = [
  { n: '01', h: 'Go deep, not wide', p: 'We learn one industry cold — its rules, language, and workflows — so the software actually does the work.' },
  { n: '02', h: 'No family slips away', p: 'We chase every diagnosis, document, and signature, following up until the intake is complete.' },
  { n: '03', h: 'Care over paperwork', p: 'Coordinators get their time back to spend on families — not forms, faxes, and follow-ups.' },
];

function Bloom({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <g transform="rotate(45 16 16)">
        <ellipse cx="16" cy="7.6" rx="4.2" ry="7" fill="#5E9462" />
        <ellipse cx="16" cy="24.4" rx="4.2" ry="7" fill="#4A7C3F" />
        <ellipse cx="7.6" cy="16" rx="7" ry="4.2" fill="#4A7C3F" />
        <ellipse cx="24.4" cy="16" rx="7" ry="4.2" fill="#5E9462" />
      </g>
      <circle cx="16" cy="16" r="3.6" fill="#2C3E2D" />
    </svg>
  );
}
const Eyebrow = ({ children, light }: { children: string; light?: boolean }) => (
  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: light ? 'rgba(255,255,255,0.85)' : '#4A7C3F' }}>{children}</span>
);

function TeamCard({ m }: { m: Member }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: '#fff', border: '1px solid rgba(43,42,38,0.06)', borderRadius: 22, padding: 18,
      display: 'flex', flexDirection: 'column',
      boxShadow: h ? '0 24px 60px rgba(26,46,31,0.14)' : '0 1px 3px rgba(26,46,31,0.05)',
      transform: h ? 'translateY(-5px)' : 'translateY(0)',
      transition: 'transform 0.4s var(--ease-dramatic), box-shadow 0.4s var(--ease-dramatic)',
    }}>
      <div style={{ width: '100%', aspectRatio: '4 / 5', borderRadius: 15, overflow: 'hidden', background: '#EAF1E6', marginBottom: 20 }}>
        <img src={m.photo} alt={m.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 22%', display: 'block', transform: h ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.5s var(--ease-dramatic)' }} />
      </div>
      <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', padding: '0 6px 6px' }}>
        <div style={{ fontSize: 19, fontWeight: 600, color: '#1A2E1F', letterSpacing: '-0.01em' }}>{m.name}</div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4A7C3F', marginTop: 6 }}>{m.role}</div>
        <p style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.6)', lineHeight: 1.6, margin: '13px 0 18px' }}>{m.bio}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 7, marginTop: 'auto' }}>
          {m.creds.map((c) => (
            <span key={c} style={{ fontSize: 11, fontWeight: 600, color: '#2C3E2D', background: '#EAF1E6', border: '1px solid rgba(74,124,63,0.18)', padding: '4px 10px', borderRadius: 100 }}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CareluCompany() {
  const [count, setCount] = useState(getLiveCount);
  useEffect(() => { const i = setInterval(() => setCount(getLiveCount()), 8000); return () => clearInterval(i); }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F3', color: '#2B2A26', fontFamily: 'var(--font-body)', overflow: 'hidden' }}>

      {/* ── HERO over sky ── */}
      <section style={{
        position: 'relative', minHeight: 'min(86vh, 760px)', display: 'flex', flexDirection: 'column',
        backgroundImage: 'linear-gradient(180deg, rgba(26,46,31,0.46) 0%, rgba(26,46,31,0.14) 34%, rgba(250,248,243,0) 74%, #FAF8F3 100%), url(/sky.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center top',
      }}>
        {/* floating nav */}
        <nav style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 5, width: 'calc(100% - 32px)', maxWidth: 1120, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 12px 12px 22px', borderRadius: 18, background: 'rgba(250,248,243,0.72)', backdropFilter: 'blur(20px) saturate(1.3)', WebkitBackdropFilter: 'blur(20px) saturate(1.3)', border: '1px solid rgba(255,255,255,0.4)' }}>
          <a href="/carelu" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <img src="/carelu-logo.png" alt="Carelu" style={{ height: 36, width: 'auto', display: 'block' }} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <a href="/carelu" className="hide-mobile" style={{ fontSize: 14, color: 'rgba(43,42,38,0.7)', textDecoration: 'none' }}>← Carelu</a>
            <Link to="/demo" style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: '#2C3E2D', padding: '11px 22px', borderRadius: 100, textDecoration: 'none' }}>Request a demo</Link>
          </div>
        </nav>

        <div style={{ margin: 'auto', maxWidth: 820, textAlign: 'center', padding: '150px 28px 80px', position: 'relative', zIndex: 2 }}>
          <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.95)', background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.34)', backdropFilter: 'blur(10px)', padding: '8px 18px', borderRadius: 100 }}>Our mission</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px,6vw,82px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.02, margin: '24px 0 0', color: '#fff' }}>
            More families,<br />into care, faster.
          </h1>
          <p style={{ fontSize: 'clamp(16px,1.5vw,20px)', color: 'rgba(255,255,255,0.92)', lineHeight: 1.65, margin: '24px auto 0', maxWidth: 600 }}>
            Behavioral health runs on intake — and intake is where families get lost. Carelu exists to make sure none of them do.
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ ...W, textAlign: 'center', padding: 'clamp(40px,6vw,80px) 28px clamp(56px,8vw,104px)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(60px,10vw,128px)', color: '#1A2E1F', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400 }}>
          {count.toLocaleString()}+
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(18px,2vw,26px)', color: 'rgba(43,42,38,0.7)', marginTop: 14 }}>
          families admitted through Carelu
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
          <span className="dot-pulse" style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#4A7C3F', display: 'inline-block' }} />
          <span style={{ fontSize: 11, color: 'rgba(43,42,38,0.6)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live</span>
        </div>

        <div className="cc-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, maxWidth: 900, margin: '56px auto 0', borderTop: '1px solid rgba(43,42,38,0.1)' }}>
          {STATS.map((s, i) => (
            <div key={s.l} style={{ padding: 'clamp(28px,3vw,40px) 24px', borderLeft: i === 0 ? 'none' : '1px solid rgba(43,42,38,0.1)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px,4vw,52px)', color: '#1A2E1F', lineHeight: 1, fontWeight: 400 }}>{s.v}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#2B2A26', marginTop: 12 }}>{s.l}</div>
              <div style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.55)', lineHeight: 1.5, marginTop: 5 }}>{s.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ background: '#F0F5EE', borderTop: '1px solid rgba(43,42,38,0.06)', borderBottom: '1px solid rgba(43,42,38,0.06)' }}>
        <div style={{ ...W, padding: 'clamp(64px,9vw,118px) 28px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,5vw,60px)' }}>
            <Eyebrow>What we believe</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,4vw,52px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.06, margin: '14px 0 0', color: '#1A2E1F' }}>
              Built to go deep.
            </h2>
          </div>
          <div className="cc-values" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {VALUES.map((v) => (
              <div key={v.n} style={{ background: '#fff', border: '1px solid rgba(43,42,38,0.06)', borderRadius: 20, padding: 'clamp(28px,2.6vw,38px)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#5E9462', fontWeight: 400 }}>{v.n}</div>
                <div style={{ fontSize: 19, fontWeight: 600, color: '#1A2E1F', letterSpacing: '-0.01em', margin: '16px 0 8px' }}>{v.h}</div>
                <p style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.6)', lineHeight: 1.65, margin: 0 }}>{v.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ ...W, padding: 'clamp(64px,9vw,118px) 28px clamp(8px,2vw,24px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(36px,4vw,52px)' }}>
          <Eyebrow>The team</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,4vw,52px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.06, margin: '14px 0 0', color: '#1A2E1F' }}>
            The people behind Carelu.
          </h2>
          <p style={{ fontSize: 'clamp(15px,1.3vw,17px)', color: 'rgba(43,42,38,0.6)', lineHeight: 1.7, maxWidth: 560, margin: '16px auto 0' }}>
            Every person was chosen for a discipline and a record of building.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 18 }}>
          {TEAM.map((m) => <TeamCard key={m.name} m={m} />)}
        </div>
      </section>

      {/* ── CAREERS ── */}
      <section style={{ ...W, padding: 'clamp(64px,9vw,118px) 28px' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: 'clamp(48px,6vw,80px) clamp(28px,5vw,64px)', textAlign: 'center', maxWidth: 920, margin: '0 auto', background: 'linear-gradient(135deg, #1A2E1F, #2C3E2D)' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(94,148,98,0.35), transparent 70%)' }} />
          <div style={{ position: 'relative' }}>
            <Eyebrow light>Careers</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.6vw,46px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.08, margin: '14px 0 0', color: '#fff' }}>
              Come build with us.
            </h2>
            <p style={{ fontSize: 'clamp(15px,1.3vw,17px)', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, margin: '16px auto 30px', maxWidth: 560 }}>
              We're always hiring exceptional engineering and customer service talent. Email us your resume and why you'd be a good fit.
            </p>
            <a href="mailto:careers@carelu.com?subject=Joining%20Carelu" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 28px', borderRadius: 100, background: '#fff', color: '#1A2E1F', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1A2E1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></svg>
              careers@carelu.com
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#F0F5EE', borderTop: '1px solid rgba(43,42,38,0.06)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', padding: 'clamp(64px,9vw,112px) 28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.6vw,48px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.08, margin: 0, color: '#1A2E1F' }}>
            Bring Carelu to your providers.
          </h2>
          <p style={{ fontSize: 'clamp(15px,1.3vw,17px)', color: 'rgba(43,42,38,0.6)', lineHeight: 1.7, margin: '16px auto 30px', maxWidth: 500 }}>
            See how Carelu captures, qualifies, and completes every intake — so no family slips away.
          </p>
          <Link to="/demo" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 100, background: '#2C3E2D', color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Request a demo →</Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '34px 28px' }}>
        <div style={{ ...W, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontSize: 13, color: 'rgba(43,42,38,0.5)' }}>
          <a href="/carelu" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img src="/carelu-logo.png" alt="Carelu" style={{ height: 22, width: 'auto', display: 'block', opacity: 0.85 }} />
          </a>
          <span>© {new Date().getFullYear()} Carelu — a LeadTrap company</span>
        </div>
      </footer>
    </div>
  );
}
