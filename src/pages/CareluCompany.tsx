import { useState, useEffect, useRef } from 'react';
import DemoModalHost from '../components/DemoModal';
import { Nav } from './Landing';

/* ================================================================
   CARELU — COMPANY / ABOUT
   ================================================================
   Matches the landing-page brand system exactly:
   - bone/cream surfaces (#FAF8F3), ink text (#1A1A1A), lime accent (#D4F25C)
   - EB Garamond display serif, DM Sans body
   - floating pill nav, white pill section labels, white cards on bone
   Structured like an enterprise "About" page: mission hero → live scale →
   story → values → leadership → trust band → careers → CTA.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const MUTED = '#8C8674';
const LIME = '#D4F25C';
const HAIR = 'rgba(43,42,38,0.08)';

const W: React.CSSProperties = { maxWidth: 1140, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };
const SECTION_PY = 'clamp(64px, 9vw, 120px)';

/* live "families admitted" counter — mirrors the homepage */
const BASELINE_DATE = new Date('2026-04-16T00:00:00Z').getTime();
const BASELINE_COUNT = 35000;
const GROWTH_PER_MS = 500 / (24 * 60 * 60 * 1000);
function getLiveCount() {
  return Math.floor(BASELINE_COUNT + Math.max(0, Date.now() - BASELINE_DATE) * GROWTH_PER_MS);
}

function Pill({ children, onSky }: { children: string; onSky?: boolean }) {
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
      ...(onSky
        ? {
            color: '#fff', background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.22)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          }
        : {
            color: INK, background: '#fff',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }),
      padding: '8px 18px', borderRadius: 100,
    }}>{children}</span>
  );
}

function SectionHead({ pill, title, sub }: { pill: string; title: React.ReactNode; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 'clamp(36px, 5vw, 56px)' }}>
      <div className="rv"><Pill>{pill}</Pill></div>
      <h2 className="rv-scale d1" style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4.2vw, 52px)',
        fontWeight: 400, color: INK, lineHeight: 1.12, letterSpacing: '-0.02em',
        margin: '14px auto 0', maxWidth: 760,
      }}>{title}</h2>
      {sub && (
        <p className="rv d2" style={{ fontSize: 'clamp(15px, 1.3vw, 17px)', color: MUTED, lineHeight: 1.7, maxWidth: 560, margin: '16px auto 0' }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ── HERO — same clean bone-and-ink format as the Solutions pages ── */
function Hero() {
  return (
    <section style={{ background: BONE, textAlign: 'center', padding: 'clamp(150px, 18vw, 220px) 24px clamp(40px, 6vw, 72px)' }}>
      <div style={{ animation: 'heroIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both' }}>
        <Pill>Our mission</Pill>
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 5.6vw, 76px)',
        fontWeight: 400, lineHeight: 1.06, letterSpacing: '-0.025em',
        color: INK, margin: '26px auto 0', maxWidth: 820,
        animation: 'heroIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both',
      }}>
        More families,<br />into care, faster.
      </h1>
      <p style={{
        fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'rgba(43,42,38,0.68)',
        lineHeight: 1.65, maxWidth: 600, margin: '24px auto 0',
        animation: 'heroIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both',
      }}>
        Behavioral health runs on intake — and intake is where families get lost.
        Carelu exists to make sure none of them do.
      </p>
      <div style={{
        display: 'inline-flex', gap: 12, marginTop: 36, flexWrap: 'wrap', justifyContent: 'center',
        animation: 'heroIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both',
      }}>
        <a href="/demo" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          fontSize: 15, fontWeight: 600, color: BONE, backgroundColor: INK,
          padding: '14px 28px', borderRadius: 100, textDecoration: 'none',
          transition: 'transform 0.2s, box-shadow 0.3s',
          boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          Get a Demo
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
        <a href="/carelu#how-it-works" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          fontSize: 15, fontWeight: 600, color: INK,
          padding: '14px 26px', borderRadius: 100, textDecoration: 'none',
          border: '1.5px solid rgba(43,42,38,0.25)', background: 'transparent',
          transition: 'border-color 0.2s, transform 0.2s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = INK; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(43,42,38,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >See How It Works</a>
      </div>
    </section>
  );
}

/* ── SCALE — live counter + stat rules ── */
function Scale() {
  const [count, setCount] = useState(getLiveCount);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const i = setInterval(() => setCount(getLiveCount()), 8000); return () => clearInterval(i); }, []);

  const stats = [
    { v: '85%', l: 'Family completion rate', s: 'Industry average is under 30%.' },
    { v: '3×', l: 'More families admitted', s: 'Same team, same hours.' },
    { v: '<10 min', l: 'First contact to intake-ready', s: 'What used to take days.' },
  ];

  return (
    <section style={{ background: BONE, paddingTop: 'clamp(40px, 6vw, 72px)', paddingBottom: 'clamp(48px, 6vw, 88px)' }}>
      <div ref={ref} style={{ ...W, textAlign: 'center' }}>
        <div className="rv-scale" style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(64px, 10vw, 128px)',
          color: INK, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400,
          fontVariantNumeric: 'lining-nums tabular-nums',
        }}>
          {count.toLocaleString()}+
        </div>
        <div className="rv d1" style={{ fontSize: 15, fontWeight: 500, color: INK, opacity: 0.6, marginTop: 14 }}>
          families admitted through Carelu
        </div>
        <div className="rv d2" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 14 }}>
          <span className="dot-pulse" style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: LIME, display: 'inline-block', boxShadow: '0 0 0 3px rgba(212, 242, 92, 0.3)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: INK, opacity: 0.5 }}>Live</span>
        </div>

        <div className="cc-stats" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
          maxWidth: 920, margin: '56px auto 0', borderTop: `1px solid ${HAIR}`, paddingTop: 8,
        }}>
          {stats.map((s, i) => (
            <div key={s.l} className={`rv d${i + 1}`} style={{ padding: 'clamp(24px, 3vw, 36px) 24px', borderLeft: i === 0 ? 'none' : `1px solid ${HAIR}` }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', color: INK, lineHeight: 1, fontWeight: 400 }}>{s.v}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: INK, marginTop: 12 }}>{s.l}</div>
              <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5, marginTop: 5 }}>{s.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── LOGOS — static trusted-by band ── */
function LogoBand() {
  const logos = [
    { src: '/logos/strive-aba.png', alt: 'Strive ABA' },
    { src: '/logos/golden-care-full.png', alt: 'Golden Care' },
    { src: '/logos/grateful-care.avif', alt: 'Grateful Care' },
    { src: '/logos/supportive-care.png', alt: 'Supportive Care' },
    { src: '/logos/cross-river.png', alt: 'Cross River' },
    { src: '/logos/totalcare.webp', alt: 'Total Care' },
    { src: '/logos/blossom-aba.webp', alt: 'Blossom ABA' },
  ];
  return (
    <section style={{ background: BONE, paddingBottom: SECTION_PY }}>
      <div style={{ ...W, textAlign: 'center' }}>
        <p className="rv" style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(43,42,38,0.42)', marginBottom: 36,
        }}>
          Trusted by the fastest growing ABA providers
        </p>
        <div className="rv d1" style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center',
          gap: 'clamp(28px, 4vw, 56px)', rowGap: 28, maxWidth: 980, margin: '0 auto',
        }}>
          {logos.map((l) => (
            <img key={l.alt} src={l.src} alt={l.alt} loading="lazy" style={{
              height: 'clamp(26px, 3vw, 36px)', width: 'auto', objectFit: 'contain',
              opacity: 0.65, filter: 'grayscale(100%) brightness(0.55) contrast(1.05)',
              transition: 'opacity 0.3s ease, filter 0.4s ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.filter = 'grayscale(0%) brightness(1) contrast(1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.65'; e.currentTarget.style.filter = 'grayscale(100%) brightness(0.55) contrast(1.05)'; }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PURPOSE — founder letter with the team photo. Replaces the team grid:
   candid group shot up top, then an editorial split — sticky serif headline
   on the left, the narrative on the right. ── */
function Purpose() {
  const paragraphs = [
    `Behavioral health doesn't have a demand problem — somewhere right now, a
     parent is searching for care for their child. It has an intake problem.
     Between that first call and the first appointment sits a maze of forms,
     faxes, eligibility checks, and follow-ups. That maze is where families
     get lost.`,
    `Carelu started inside real ABA clinics, not a pitch deck. We sat next to
     intake coordinators and counted the hours lost to phone tag and missing
     consent forms — and the families who simply gave up waiting. Providers
     wanted to help more children. The paperwork was the bottleneck.`,
    `AI finally made a different kind of intake possible. But bolting a
     chatbot onto a broken process doesn't fix the process. Intake had to be
     rebuilt end to end — every channel, every document, every follow-up —
     as one system that owns the outcome.`,
    `So that's what we built: a care enablement platform that answers every
     family instantly, verifies eligibility, collects every document, and
     follows up until each case is complete and ready for care.`,
    `Today Carelu runs intake for the fastest-growing ABA providers in the
     country. The goal hasn't changed: your team spends its time on care,
     our software does the chasing — and every family who can receive care,
     does.`,
  ];

  return (
    <section id="story" style={{ background: '#fff', borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}`, paddingTop: SECTION_PY, paddingBottom: SECTION_PY }}>
      <div style={{ ...W, maxWidth: 1040 }}>
        {/* Group photo */}
        <div className="rv-scale" style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 70px rgba(0,0,0,0.12)' }}>
          <img
            src="/team-photo.jpg"
            alt="Carelu leadership team"
            style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', objectPosition: 'center 38%', display: 'block' }}
          />
          <span style={{
            position: 'absolute', left: 16, bottom: 16,
            fontSize: 12, fontWeight: 600, color: INK,
            background: 'rgba(250,248,243,0.92)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            padding: '8px 16px', borderRadius: 100,
          }}>
            Carelu leadership team
          </span>
        </div>

        {/* Editorial split: headline pinned left, letter on the right */}
        <div className="cc-purpose-grid" style={{
          display: 'grid', gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.3fr)',
          gap: 'clamp(36px, 6vw, 88px)', marginTop: 'clamp(44px, 6vw, 72px)',
          alignItems: 'start',
        }}>
          <div className="cc-purpose-head" style={{ position: 'sticky', top: 110 }}>
            <div className="rv"><Pill>Why we exist</Pill></div>
            <h2 className="rv-scale d1" style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 3.6vw, 46px)',
              fontWeight: 400, color: INK, lineHeight: 1.18, letterSpacing: '-0.02em',
              margin: '16px 0 0',
            }}>
              Software should do the chasing. People should do the caring.
            </h2>
          </div>

          <div style={{ fontSize: 16, color: 'rgba(43,42,38,0.78)', lineHeight: 1.85 }}>
            {paragraphs.map((p, i) => (
              <p key={i} className={`rv d${Math.min(i + 1, 5)}`} style={{ margin: i === 0 ? 0 : '22px 0 0' }}>
                {p.replace(/\s+/g, ' ').trim()}
              </p>
            ))}
            <div className="rv d5" style={{ marginTop: 32 }}>
              <div style={{ width: 36, height: 2, background: LIME, marginBottom: 16 }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: INK }}>The Carelu founding team</div>
              <div style={{ fontSize: 13.5, color: MUTED, marginTop: 4 }}>Building for behavioral health since day one</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── VALUES ── */
function Values() {
  const values = [
    { n: '01', h: 'Go deep, not wide', p: 'We focus on ABA so we can understand the core intake workflows deeply enough to replace the parts that waste human potential — not just paper over them.' },
    { n: '02', h: 'No family slips away', p: 'We chase every diagnosis, document, and signature, following up until the intake is complete.' },
    { n: '03', h: 'Care over paperwork', p: 'Coordinators get their time back to spend on families — not forms, faxes, and follow-ups.' },
  ];
  return (
    <section style={{ background: BONE, paddingTop: SECTION_PY, paddingBottom: SECTION_PY }}>
      <div style={W}>
        <SectionHead pill="What we believe" title="Principles we run on." />
        <div className="cc-values" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {values.map((v, i) => (
            <div key={v.n} className={`rv-scale d${i + 1}`} style={{
              background: '#fff', borderRadius: 20, padding: 'clamp(28px, 2.6vw, 38px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
              transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(20, 40, 30, 0.12), 0 2px 6px rgba(0,0,0,0.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)'; }}
            >
              <span style={{
                width: 30, height: 30, borderRadius: '50%',
                background: LIME, color: INK,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
              }}>{v.n}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2vw, 25px)', fontWeight: 400, color: INK, letterSpacing: '-0.01em', margin: '18px 0 10px' }}>{v.h}</h3>
              <p style={{ fontSize: 14.5, color: MUTED, lineHeight: 1.65, margin: 0 }}>{v.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── TRUST — quiet compliance band, enterprise signal ── */
function Trust() {
  const items = [
    { label: 'HIPAA', detail: 'BAAs signed with every provider' },
    { label: 'SOC 2 Type II', detail: 'Audited annually, monitored continuously' },
    { label: 'AES-256', detail: 'Encrypted at rest and in transit' },
    { label: 'US data centers', detail: 'No offshore processing of PHI' },
  ];
  return (
    <section style={{ background: '#fff', borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}`, padding: 'clamp(40px, 5vw, 64px) 0' }}>
      <div style={W}>
        <div className="cc-trust" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {items.map((it, i) => (
            <div key={it.label} className={`rv d${i + 1}`} style={{ padding: '8px 24px', borderLeft: i === 0 ? 'none' : `1px solid ${HAIR}`, textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7, flexShrink: 0 }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                </svg>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: INK }}>{it.label}</span>
              </div>
              <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5, marginTop: 6 }}>{it.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CAREERS ── */
function Careers() {
  return (
    <section id="careers" style={{ background: BONE, paddingTop: SECTION_PY, paddingBottom: SECTION_PY }}>
      <div style={W}>
        <div className="rv-scale" style={{
          position: 'relative', overflow: 'hidden', borderRadius: 24,
          padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 64px)',
          textAlign: 'center', maxWidth: 940, margin: '0 auto',
          background: INK,
        }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(212,242,92,0.16), transparent 70%)' }} />
          <div style={{ position: 'relative' }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: LIME }}>Careers</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 46px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.08, margin: '14px 0 0', color: '#fff' }}>
              Come build with us.
            </h2>
            <p style={{ fontSize: 'clamp(15px, 1.3vw, 17px)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: '16px auto 30px', maxWidth: 540 }}>
              We're always hiring exceptional engineering and customer-facing talent.
              Email us your resume and why you'd be a good fit.
            </p>
            <a href="mailto:careers@carelu.com?subject=Joining%20Carelu" style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              padding: '14px 28px', borderRadius: 100,
              background: '#fff', color: INK, fontSize: 15, fontWeight: 600, textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.3s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.35)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></svg>
              careers@carelu.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT — structured inquiries, the enterprise "get in touch" ── */
function Contact() {
  const channels = [
    { label: 'General inquiries', email: 'hello@carelu.com', desc: 'Questions about Carelu, partnerships, or press.' },
    { label: 'Sales & demos', email: 'sales@carelu.com', desc: 'See Carelu running on your own intake workflow.' },
    { label: 'Careers', email: 'careers@carelu.com', desc: 'Join the team building care enablement.' },
    { label: 'Security & compliance', email: 'security@carelu.com', desc: 'Audit reports, BAAs, and security documentation.' },
  ];
  return (
    <section style={{ background: BONE, paddingTop: SECTION_PY, paddingBottom: SECTION_PY }}>
      <div style={W}>
        <SectionHead pill="Contact" title="Talk to the right team, directly." />
        <div className="cc-contact" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
          maxWidth: 1080, margin: '0 auto',
        }}>
          {channels.map((c, i) => (
            <a key={c.label} href={`mailto:${c.email}`} className={`rv d${i + 1}`} style={{
              display: 'block', textDecoration: 'none',
              background: '#fff', borderRadius: 18, padding: '26px 24px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
              transition: 'transform 0.4s var(--ease-dramatic), box-shadow 0.4s var(--ease-dramatic)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)'; }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED }}>{c.label}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: INK, margin: '10px 0 8px', wordBreak: 'break-all' }}>{c.email}</div>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.55, margin: 0 }}>{c.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA + FOOTER ── */
function CtaFooter() {
  return (
    <>
      <section style={{ background: '#fff', borderTop: `1px solid ${HAIR}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', padding: `${SECTION_PY} 24px` }}>
          <h2 className="rv-scale" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 3.8vw, 48px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0, color: INK }}>
            See what your intake could look like.
          </h2>
          <p className="rv d1" style={{ fontSize: 'clamp(15px, 1.3vw, 17px)', color: MUTED, lineHeight: 1.7, margin: '16px auto 30px', maxWidth: 480 }}>
            Carelu captures, qualifies, and completes every intake — so no family slips away.
          </p>
          <a href="/demo" className="rv d2" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '15px 32px', borderRadius: 100,
            background: INK, color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none',
            transition: 'transform 0.2s, box-shadow 0.3s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.25)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Get a Demo
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      {/* Same content as the home-page footer bottom row, on bone instead of the landscape */}
      <footer style={{ background: BONE, borderTop: `1px solid ${HAIR}`, padding: '28px 24px' }}>
        <div style={{ ...W, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <a href="/carelu" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src="/carelu-logo.svg" alt="Carelu" style={{ height: 24, width: 'auto', display: 'block' }} />
            </a>
            <span style={{ width: 1, height: 18, background: 'rgba(43,42,38,0.2)', display: 'inline-block' }} />
            <span style={{
              fontSize: 11, color: MUTED, fontWeight: 500,
              letterSpacing: '0.16em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              Powered by
            </span>
            <img src="/leadtrap-full.svg" alt="LeadTrap" style={{ height: 24, width: 'auto', display: 'block' }} />
          </div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: MUTED }}>© {new Date().getFullYear()} Carelu, Inc.</span>
            <a href="#" style={{ fontSize: 12, color: MUTED, textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ fontSize: 12, color: MUTED, textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ fontSize: 12, color: MUTED, textDecoration: 'none' }}>Security</a>
            <span style={{ fontSize: 12, color: MUTED }}>HIPAA · SOC 2</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default function CareluCompany() {
  // same reveal-on-scroll behavior as the landing page
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );
    document.querySelectorAll('.rv, .rv-scale, .rv-left, .rv-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="session-light" style={{ minHeight: '100vh', background: BONE, color: '#2B2A26', fontFamily: 'var(--font-body)' }}>
      <DemoModalHost />
      <Nav base="/carelu" />
      <Hero />
      <Scale />
      <LogoBand />
      <Purpose />
      <Values />
      <Trust />
      <Careers />
      <Contact />
      <CtaFooter />
    </div>
  );
}
