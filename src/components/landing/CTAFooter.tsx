import Logo from '../Logo';

export default function CTAFooter() {
  return (
    <>
      {/* CTA */}
      <section id="cta" style={{
        margin: '0 32px',
        borderRadius: 24,
        background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
        padding: '80px 48px',
        marginBottom: 48,
      }}>
        <div style={{ maxWidth: 600 }}>
          <h2 style={{ fontSize: 44, fontWeight: 800, color: '#fff', lineHeight: 1.08, letterSpacing: '-1.5px', margin: '0 0 16px' }}>
            Stop losing families to a broken process.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: '0 0 36px', maxWidth: 460 }}>
            See how Carelu turns your inbound demand into completed, ready-to-process intakes.
          </p>
          <a
            href="mailto:hello@carelu.ai"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 14, fontWeight: 600, color: '#7c3aed', backgroundColor: '#fff',
              padding: '14px 28px', borderRadius: 999, textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Get in Touch
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Logo size={28} />
        </div>
        <p style={{ fontSize: 12, color: '#999', margin: 0 }}>&copy; 2026 Carelu, Inc. All rights reserved.</p>
      </footer>
    </>
  );
}
