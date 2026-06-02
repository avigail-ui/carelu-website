import { Link } from 'react-router-dom';
import Logo from '../Logo';

export default function Header() {
  return (
    <header style={{
      position: 'fixed',
      top: 20,
      left: 0,
      right: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(60, 55, 90, 0.55)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 999,
        padding: '8px 8px 8px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        pointerEvents: 'auto',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginRight: 24 }}>
          <Logo size={32} />
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {['Problem', 'Platform', 'How It Works', 'FAQ'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#fff',
                textDecoration: 'none',
                letterSpacing: '-0.1px',
                padding: '8px 16px',
                borderRadius: 999,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {item}
            </a>
          ))}
          <a
            href="#cta"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#1a1a1a',
              backgroundColor: '#fff',
              padding: '10px 22px',
              borderRadius: 999,
              textDecoration: 'none',
              marginLeft: 16,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0f0f0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}
          >
            Get in Touch
          </a>
        </nav>
      </div>
    </header>
  );
}
