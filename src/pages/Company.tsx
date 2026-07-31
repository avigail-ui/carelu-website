import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { careluRevealed } from '../lib/careluReveal';

const accent = '#3a8ab0';
const W = { maxWidth: 820, margin: '0 auto', padding: '0 28px' };

export default function Company() {
  const revealed = careluRevealed();
  useSeo({
    title: 'LeadTrap — The AI front office for service businesses',
    description: 'LeadTrap builds the AI front office that captures every lead, qualifies it, and carries it to a complete record — the company behind Carelu.',
    canonical: 'https://leadtrap.com/company',
  });
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c', color: '#fff', overflow: 'hidden' }}>
      <header style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.jpeg" alt="" style={{ height: 28, width: 28, borderRadius: 7 }} />
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 19, color: '#fff', letterSpacing: '-0.02em' }}>LeadTrap</span>
        </Link>
        {revealed && <a href="https://carelu.com" style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Carelu →</a>}
      </header>

      <main style={{ ...W, paddingTop: 'clamp(56px, 11vw, 130px)', paddingBottom: 120 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent }}>The company</span>
        <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(28px, 4.4vw, 52px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '16px 0 0' }}>
          Vertical AI for the<br />businesses built on intake.
        </h1>
        <p style={{ fontSize: 'clamp(15px, 1.3vw, 17px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginTop: 24, maxWidth: 660 }}>
          Every service business lives or dies on the first conversation — the inquiry that comes in and either becomes a customer or quietly disappears. LeadTrap builds the AI front office that makes sure none of them slip away: capturing every lead, qualifying it against the rules that matter, and carrying it all the way to a complete, ready record.
        </p>

        <div style={{ marginTop: 64, display: 'grid', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { h: 'We go deep, not wide', p: 'Generic AI is shallow everywhere. We build vertical AI that knows one industry cold — its rules, its language, its workflows — so it actually does the work instead of describing it.' },
            { h: 'The data compounds', p: 'Every conversation makes the system sharper for the next provider. That flywheel is something a horizontal tool can never catch up to.' },
            { h: 'Software that does the job', p: 'Not a dashboard that reminds you to do the work — a system that does it, so your people spend their time on the human part.' },
          ].map((x, i) => (
            <div key={i} style={{ background: '#0c0c0f', padding: '28px 30px' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 17, color: '#fff', marginBottom: 8, letterSpacing: '-0.01em' }}>{x.h}</div>
              <div style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{x.p}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 56 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent }}>Our flagship product</span>
          {revealed ? (
            <a href="https://carelu.com" style={{ display: 'block', marginTop: 16, textDecoration: 'none', padding: '32px', borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: '#fff' }}>Carelu</div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginTop: 10, maxWidth: 580 }}>
                The AI intake and lead-generation system for ABA and behavioral health providers — answering every family across every channel, qualifying them on contact, and completing the intake your coordinators used to chase for weeks.
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: accent, marginTop: 18 }}>Visit Carelu →</div>
            </a>
          ) : (
            <div style={{ marginTop: 16, padding: '32px', borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 26, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>Coming soon</div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginTop: 10, maxWidth: 580 }}>
                Our first vertical AI front office is in stealth. We&rsquo;ll share more soon.
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 72, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'clamp(22px, 2.6vw, 32px)', color: '#fff', lineHeight: 1.2, letterSpacing: '-0.02em' }}>Building something for your industry?</div>
          <a href="mailto:hello@leadtrap.com" style={{ display: 'inline-block', marginTop: 22, padding: '14px 30px', borderRadius: 100, background: '#fff', color: '#000', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Get in touch</a>
        </div>
      </main>

      <footer style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 18, padding: '28px', fontSize: 12, color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <a href="/privacy" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Privacy</a>
        <a href="/terms" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Terms</a>
        <span>© {new Date().getFullYear()} LeadTrap</span>
      </footer>
    </div>
  );
}
