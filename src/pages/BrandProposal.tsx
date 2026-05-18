/* ============================================================
   BRAND PROPOSAL PREVIEW
   Side-by-side: current vs proposed visual identity
   ============================================================ */

// ── Proposed palette ──
const P = {
  ink: '#1A1F2E',
  stone: '#F5F2ED',
  coral: '#D4735E',
  coralLight: '#F8ECE7',
  sage: '#C5CEC0',
  sageLight: '#E8ECE6',
  text: '#4A4A4A',
  textMuted: '#8A8580',
  white: '#FFFFFF',
};

// ── Current palette ──
const C = {
  green900: '#1B2E1E',
  green800: '#2C3E2D',
  green700: '#3A5A3C',
  sage50: '#F0F5EE',
  sage100: '#E4EFE0',
  white: '#FFFFFF',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 80 }}>
      <h2 style={{ fontFamily: 'system-ui', fontSize: 13, fontWeight: 700, color: '#999', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 32 }}>{title}</h2>
      {children}
    </div>
  );
}

function ColorSwatch({ color, name, hex }: { color: string; name: string; hex: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 100, height: 100, borderRadius: 16, backgroundColor: color, border: '1px solid rgba(0,0,0,0.08)', marginBottom: 10 }} />
      <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{name}</div>
      <div style={{ fontSize: 12, color: '#999', fontFamily: 'monospace' }}>{hex}</div>
    </div>
  );
}

export default function BrandProposal() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: 'system-ui, sans-serif', padding: '48px 32px' }}>
      {/* Load proposed fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 48, fontWeight: 300, color: '#333', marginBottom: 8, letterSpacing: '-1px' }}>Brand Proposal</h1>
        <p style={{ fontSize: 17, color: '#888', marginBottom: 64 }}>Current vs. Proposed — side by side</p>

        {/* ── COLOR PALETTES ── */}
        <Section title="Color Palette">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#666', marginBottom: 20 }}>Current</h3>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <ColorSwatch color={C.green900} name="Green 900" hex="#1B2E1E" />
                <ColorSwatch color={C.green800} name="Green 800" hex="#2C3E2D" />
                <ColorSwatch color={C.green700} name="Green 700" hex="#3A5A3C" />
                <ColorSwatch color={C.sage50} name="Sage 50" hex="#F0F5EE" />
                <ColorSwatch color={C.white} name="White" hex="#FFFFFF" />
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#666', marginBottom: 20 }}>Proposed</h3>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <ColorSwatch color={P.ink} name="Deep Ink" hex="#1A1F2E" />
                <ColorSwatch color={P.coral} name="Living Coral" hex="#D4735E" />
                <ColorSwatch color={P.sage} name="Sage Mist" hex="#C5CEC0" />
                <ColorSwatch color={P.stone} name="Warm Stone" hex="#F5F2ED" />
                <ColorSwatch color={P.white} name="White" hex="#FFFFFF" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── TYPOGRAPHY ── */}
        <Section title="Typography">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#666', marginBottom: 20 }}>Current — EB Garamond + DM Sans</h3>
              <div style={{ background: '#fff', borderRadius: 16, padding: 40, border: '1px solid #eee' }}>
                <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 48, fontWeight: 500, color: C.green900, letterSpacing: '-1px', marginBottom: 16 }}>
                  Fewer families lost.
                </div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: '#555', lineHeight: 1.7 }}>
                  Behind every inquiry is a family in crisis. Carelu makes sure none of them slip through the cracks.
                </p>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#666', marginBottom: 20 }}>Proposed — Fraunces + Outfit</h3>
              <div style={{ background: P.stone, borderRadius: 16, padding: 40, border: '1px solid #e5e0d8' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 48, fontWeight: 500, color: P.ink, letterSpacing: '-1px', marginBottom: 16 }}>
                  Fewer families lost.
                </div>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, color: P.text, lineHeight: 1.7 }}>
                  Behind every inquiry is a family in crisis. Carelu makes sure none of them slip through the cracks.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── LOGO ── */}
        <Section title="Logo">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#666', marginBottom: 20 }}>Current</h3>
              <div style={{ background: '#fff', borderRadius: 16, padding: '48px 40px', border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#3A5A3C', display: 'inline-block' }} />
                <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 44, fontWeight: 500, color: C.green900, letterSpacing: '-1.2px' }}>carelu</span>
              </div>
              <div style={{ background: C.green900, borderRadius: 16, padding: '48px 40px', marginTop: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#7aa67e', display: 'inline-block' }} />
                <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 44, fontWeight: 500, color: '#fff', letterSpacing: '-1.2px' }}>carelu</span>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#666', marginBottom: 20 }}>Proposed</h3>
              <div style={{ background: P.stone, borderRadius: 16, padding: '48px 40px', border: '1px solid #e5e0d8', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: P.coral, display: 'inline-block' }} />
                <span style={{ fontFamily: 'Fraunces, serif', fontSize: 44, fontWeight: 500, color: P.ink, letterSpacing: '-1.2px' }}>carelu</span>
              </div>
              <div style={{ background: P.ink, borderRadius: 16, padding: '48px 40px', marginTop: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: P.coral, display: 'inline-block' }} />
                <span style={{ fontFamily: 'Fraunces, serif', fontSize: 44, fontWeight: 500, color: '#fff', letterSpacing: '-1.2px' }}>carelu</span>
              </div>
            </div>
          </div>
        </Section>

        {/* ── HERO MOCKUP ── */}
        <Section title="Hero Section Comparison">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            {/* Current */}
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#666', marginBottom: 20 }}>Current</h3>
              <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #eee' }}>
                <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3A5A3C' }} />
                    <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 22, color: C.green900, fontWeight: 500 }}>carelu</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: C.green800, padding: '6px 16px', borderRadius: 8 }}>Request a Demo</span>
                </div>
                <div style={{ padding: '48px 28px', background: C.sage50 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.green800, background: C.sage100, padding: '4px 12px', borderRadius: 999, marginBottom: 16, display: 'inline-block' }}>Care Enablement Platform</span>
                  <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 36, fontWeight: 400, color: C.green900, lineHeight: 1.1, marginBottom: 16 }}>
                    Fewer families lost.<br />More care <em>delivered.</em>
                  </div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 24 }}>
                    Behind every inquiry is a family in crisis.
                  </p>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: C.green800, padding: '12px 24px', borderRadius: 10, display: 'inline-block' }}>Request a Demo →</span>
                </div>
              </div>
            </div>

            {/* Proposed */}
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#666', marginBottom: 20 }}>Proposed</h3>
              <div style={{ background: P.stone, borderRadius: 20, overflow: 'hidden', border: '1px solid #e5e0d8' }}>
                <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e5e0d8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: P.coral }} />
                    <span style={{ fontFamily: 'Fraunces, serif', fontSize: 22, color: P.ink, fontWeight: 500 }}>carelu</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: P.coral, padding: '6px 16px', borderRadius: 8 }}>Request a Demo</span>
                </div>
                <div style={{ padding: '48px 28px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: P.coral, background: P.coralLight, padding: '4px 12px', borderRadius: 999, marginBottom: 16, display: 'inline-block' }}>Care Enablement Platform</span>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 500, color: P.ink, lineHeight: 1.1, marginBottom: 16 }}>
                    Fewer families lost.<br />More care <em>delivered.</em>
                  </div>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: P.text, lineHeight: 1.6, marginBottom: 24 }}>
                    Behind every inquiry is a family in crisis.
                  </p>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: P.coral, padding: '12px 24px', borderRadius: 10, display: 'inline-block' }}>Request a Demo →</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── CARD STYLES ── */}
        <Section title="Card / Section Styles">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#666', marginBottom: 20 }}>Current — Dark Green Section</h3>
              <div style={{ background: C.green900, borderRadius: 20, padding: 40 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#7aa67e', background: 'rgba(255,255,255,0.08)', padding: '4px 12px', borderRadius: 999, display: 'inline-block', marginBottom: 16 }}>The problem</span>
                <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 28, fontWeight: 400, color: '#fff', lineHeight: 1.15, marginBottom: 20 }}>
                  The front door is broken.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {['70%', '5+'].map((v) => (
                    <div key={v} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '24px 20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 36, color: '#c5cec0' }}>{v}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>stat description</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#666', marginBottom: 20 }}>Proposed — Deep Ink Section</h3>
              <div style={{ background: P.ink, borderRadius: 20, padding: 40 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: P.coral, background: 'rgba(212,115,94,0.12)', padding: '4px 12px', borderRadius: 999, display: 'inline-block', marginBottom: 16 }}>The problem</span>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 500, color: '#fff', lineHeight: 1.15, marginBottom: 20 }}>
                  The front door is broken.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {['70%', '5+'].map((v) => (
                    <div key={v} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '24px 20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 36, color: P.coral }}>{v}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit, sans-serif' }}>stat description</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── BUTTONS ── */}
        <Section title="Buttons & Pills">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#666', marginBottom: 20 }}>Current</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: C.green800, padding: '14px 28px', borderRadius: 10 }}>Request a Demo →</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.green800, background: C.sage100, padding: '6px 14px', borderRadius: 999 }}>What changes</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: C.green800, padding: '6px 14px', borderRadius: 999 }}>The problem</span>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#666', marginBottom: 20 }}>Proposed</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: P.coral, padding: '14px 28px', borderRadius: 10, fontFamily: 'Outfit, sans-serif' }}>Request a Demo →</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: P.coral, background: P.coralLight, padding: '6px 14px', borderRadius: 999, fontFamily: 'Outfit, sans-serif' }}>What changes</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: P.ink, padding: '6px 14px', borderRadius: 999, fontFamily: 'Outfit, sans-serif' }}>The problem</span>
              </div>
            </div>
          </div>
        </Section>

        {/* ── CTA COMPARISON ── */}
        <Section title="CTA Section">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#666', marginBottom: 20 }}>Current</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
                <div style={{ background: C.sage100, borderRadius: 16, padding: 32 }}>
                  <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 24, color: C.green900, lineHeight: 1.15 }}>Somewhere right now, a parent is searching for care.</div>
                </div>
                <div style={{ background: C.green800, borderRadius: 16, padding: 32, display: 'flex', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Request a Demo →</span>
                </div>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#666', marginBottom: 20 }}>Proposed</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
                <div style={{ background: P.sageLight, borderRadius: 16, padding: 32 }}>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, color: P.ink, lineHeight: 1.15 }}>Somewhere right now, a parent is searching for care.</div>
                </div>
                <div style={{ background: P.coral, borderRadius: 16, padding: 32, display: 'flex', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Request a Demo →</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── FULL PALETTE STRIP ── */}
        <Section title="Full Palette Strip">
          <div style={{ display: 'flex', borderRadius: 16, overflow: 'hidden', height: 80 }}>
            {[P.ink, P.coral, P.sage, P.stone, P.white].map((c) => (
              <div key={c} style={{ flex: 1, background: c, border: '1px solid rgba(0,0,0,0.05)' }} />
            ))}
          </div>
          <div style={{ display: 'flex', marginTop: 8 }}>
            {['Deep Ink', 'Living Coral', 'Sage Mist', 'Warm Stone', 'White'].map((n) => (
              <div key={n} style={{ flex: 1, fontSize: 11, color: '#999', textAlign: 'center' }}>{n}</div>
            ))}
          </div>
        </Section>

      </div>
    </div>
  );
}
