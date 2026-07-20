import { FRONT_OFFICE_RISKS } from '../data/risks';
import type { RiskTag } from '../data/risks';

/* Shared "front-office risks" section — rendered on the risks page and
   embedded in the Zapier/Make page. All content renders (crawlable). */

const INK = '#1A1A1A';
const TAG_COLOR: Record<RiskTag, { fg: string; bg: string }> = {
  Compliance: { fg: '#b0432b', bg: 'rgba(176,67,43,0.10)' },
  Revenue: { fg: '#2e5a26', bg: 'rgba(63,122,52,0.10)' },
  Clinical: { fg: '#3a5f86', bg: 'rgba(58,95,134,0.10)' },
};

export default function FrontOfficeRisksSection({ heading = true }: { heading?: boolean }) {
  return (
    <div>
      {heading && (
        <>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.9vw, 36px)', fontWeight: 400,
            color: INK, lineHeight: 1.15, letterSpacing: '-0.018em', margin: '0 0 12px',
          }}>The risks the front office actually carries.</h2>
          <p className="rv" style={{ fontSize: 15.5, color: 'rgba(43,42,38,0.7)', lineHeight: 1.7, margin: '0 0 24px' }}>
            Intake looks like admin. It isn’t. It’s where compliance, revenue, and clinical readiness are
            won or lost — long before a claim is ever filed. These are the risks that live in the front office.
          </p>
        </>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {FRONT_OFFICE_RISKS.map((r) => {
          const c = TAG_COLOR[r.tag];
          return (
            <div key={r.title} className="rv" style={{
              background: '#fff', borderRadius: 16, padding: 'clamp(18px, 2.4vw, 26px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.fg, background: c.bg, padding: '3px 10px', borderRadius: 100 }}>{r.tag}</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: INK, margin: 0, fontFamily: 'var(--font-body)' }}>{r.title}</h3>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(43,42,38,0.72)', lineHeight: 1.65, margin: '0 0 10px' }}>{r.risk}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="risk-grid">
                <div style={{ background: 'rgba(176,67,43,0.05)', borderRadius: 10, padding: '11px 14px' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#b0432b', marginBottom: 4 }}>The cost</div>
                  <p style={{ fontSize: 13, color: 'rgba(43,42,38,0.7)', lineHeight: 1.55, margin: 0 }}>{r.consequence}</p>
                </div>
                <div style={{ background: 'rgba(63,122,52,0.06)', borderRadius: 10, padding: '11px 14px' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#2e5a26', marginBottom: 4 }}>How Carelu reduces it</div>
                  <p style={{ fontSize: 13, color: 'rgba(43,42,38,0.7)', lineHeight: 1.55, margin: 0 }}>{r.mitigation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style>{`@media (max-width: 640px) { .risk-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
