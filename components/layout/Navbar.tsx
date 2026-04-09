'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const navLinks = [
  { href: '/', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar({ logoUrl, logoText }: { logoUrl?: string; logoText?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const fn = () => {
      // Go solid once we've scrolled past the hero (approx 80vh)
      const heroH = window.innerHeight * 0.8;
      setScrolled(window.scrollY > heroH);
    };
    fn(); // run once on mount
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const LogoEl = () => {
    if (logoUrl) {
      return (
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src={logoUrl} alt={logoText || 'Logo'} style={{ height: 36, width: 'auto', objectFit: 'contain', maxWidth: 160 }} />
        </Link>
      );
    }
    return (
      <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: 'var(--text)', textDecoration: 'none', letterSpacing: '-0.04em' }}>
        {logoText || 'C#'}
      </Link>
    );
  };

  return (
    <>
      <nav className={`nav-root${scrolled ? ' scrolled' : ''}`}>
        <LogoEl />

        <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none', alignItems: 'center' }} id="desktop-nav">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link href={link.href} style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, color: pathname === link.href ? 'var(--text)' : 'var(--text-muted)', textDecoration: 'none', letterSpacing: '0.02em', transition: 'color 0.2s', borderBottom: pathname === link.href ? '1px solid var(--primary)' : '1px solid transparent', paddingBottom: '2px' }}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={toggle} aria-label="Toggle theme" className="theme-toggle-btn">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link href="/contact" className="btn-primary" id="nav-cta" style={{ padding: '0.55rem 1.4rem', fontSize: '0.85rem' }}>Let's Talk</Link>
          <button id="hamburger" onClick={() => setMobileOpen(v => !v)} aria-label="Menu" style={{ width: 38, height: 38, border: '1.5px solid var(--border-strong)', borderRadius: '0.5rem', background: 'transparent', color: 'var(--text)', cursor: 'none', display: 'none', alignItems: 'center', justifyContent: 'center' }}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`}>
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>{link.label}</Link>
        ))}
        <button onClick={toggle} style={{ marginTop: '1rem', background: 'transparent', border: '1.5px solid var(--border-strong)', borderRadius: '9999px', padding: '0.6rem 1.4rem', color: 'var(--text-muted)', cursor: 'none', fontFamily: 'var(--font-body)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <style>{`
        .theme-toggle-btn {
          width: 38px; height: 38px; border-radius: 50%;
          border: 1.5px solid var(--border-strong);
          background: transparent;
          color: var(--text-muted);
          cursor: none;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .theme-toggle-btn:hover {
          color: var(--text);
          border-color: var(--text);
          background: var(--surface-high);
        }
        @media (max-width: 768px) {
          #desktop-nav { display: none !important; }
          #hamburger { display: flex !important; }
          #nav-cta { display: none !important; }
        }
      `}</style>
    </>
  );
}
