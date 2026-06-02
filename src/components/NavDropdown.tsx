import { useState } from 'react';
import { Link } from 'react-router-dom';

const bySpecialty = [
  { slug: 'aba-therapy', label: 'ABA Therapy' },
  { slug: 'mental-health', label: 'Mental Health' },
  { slug: 'home-care', label: 'Home Care' },
  { slug: 'addiction-treatment', label: 'Addiction Treatment' },
  { slug: 'hospice', label: 'Hospice' },
];

const bySize = [
  { slug: 'single-site', label: 'Single-Site' },
  { slug: 'multi-site', label: 'Multi-Site' },
  { slug: 'enterprise', label: 'Enterprise' },
];

export default function NavDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        style={{
          fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--green-900)',
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '8px 16px', fontFamily: 'inherit', borderRadius: 999,
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.06)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        Who We Serve
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown panel */}
      <div style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        paddingTop: 12,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid var(--gray-200)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
          padding: '20px 12px',
          display: 'flex',
          gap: 8,
        }}>
          {/* By Specialty */}
          <div style={{ minWidth: 200 }}>
            <div style={{ padding: '4px 16px 12px', fontSize: 11, fontWeight: 600, color: 'var(--green-700)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              By Specialty
            </div>
            {bySpecialty.map((v) => (
              <Link key={v.slug} to={`/for/${v.slug}`} style={{ display: 'block', padding: '9px 16px', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--green-900)', textDecoration: 'none', borderRadius: 8, transition: 'background-color 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--sage-50)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >{v.label}</Link>
            ))}
          </div>
          {/* Divider */}
          <div style={{ width: 1, background: 'var(--gray-200)', margin: '8px 0' }} />
          {/* By Size */}
          <div style={{ minWidth: 160 }}>
            <div style={{ padding: '4px 16px 12px', fontSize: 11, fontWeight: 600, color: 'var(--green-700)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              By Size
            </div>
            {bySize.map((v) => (
              <Link key={v.slug} to={`/for/${v.slug}`} style={{ display: 'block', padding: '9px 16px', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--green-900)', textDecoration: 'none', borderRadius: 8, transition: 'background-color 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--sage-50)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >{v.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
