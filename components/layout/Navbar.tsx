'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function Navbar({ logoUrl, logoText }: { logoUrl?: string; logoText?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const isLight = theme === 'light';
  const onPortfolio = pathname.startsWith('/portfolio');
  const navLinks = [
    { href: onPortfolio ? '/portfolio' : '/', label: onPortfolio ? 'Work' : 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  // Keep the homepage hero navbar high-contrast until the page is scrolled.
  const navOnHero = pathname === '/' && !scrolled;
  const navTextColor = navOnHero ? 'rgba(255,255,255,0.95)' : 'var(--text)';
  const navMutedColor = navOnHero ? 'rgba(255,255,255,0.72)' : 'var(--text-muted)';
  const navBorderColor = navOnHero ? 'rgba(255,255,255,0.34)' : 'var(--border-strong)';

  useEffect(() => {
    const fn = () => {
      const heroH = window.innerHeight * 0.8;
      setScrolled(window.scrollY > heroH);
    };
    fn();
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
          <img
            src={logoUrl}
            alt={logoText || 'Logo'}
            style={{
              height: 36,
              width: 'auto',
              objectFit: 'contain',
              maxWidth: 160,
              // Keep logo visible over transparent hero, then revert to theme-appropriate contrast once scrolled.
              filter: navOnHero ? 'brightness(0) invert(1)' : isLight ? 'brightness(0)' : 'brightness(1)',
              transition: 'filter 0.3s ease',
            }}
          />
        </Link>
      );
    }

    // Text logo with explicit color that adapts to theme
    return (
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '1.5rem',
          color: navTextColor,
          textDecoration: 'none',
          letterSpacing: '-0.04em',
          transition: 'color 0.3s ease',
        }}
      >
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
              <Link
                href={link.href}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: pathname === link.href ? navTextColor : navMutedColor,
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                  transition: 'color 0.2s',
                  borderBottom: pathname === link.href ? '1px solid var(--primary)' : '1px solid transparent',
                  paddingBottom: '2px',
                }}
              >
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
          <button
            id="hamburger"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
            style={{
              width: 38,
              height: 38,
              border: `1.5px solid ${navBorderColor}`,
              borderRadius: '0.5rem',
              background: 'transparent',
              color: navTextColor,
              cursor: 'none',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`}>
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>{link.label}</Link>
        ))}
        <button
          onClick={toggle}
          style={{
            marginTop: '1rem',
            background: 'transparent',
            border: '1.5px solid var(--border-strong)',
            borderRadius: '9999px',
            padding: '0.6rem 1.4rem',
            color: 'var(--text-muted)',
            cursor: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <style>{`
        .theme-toggle-btn {
          width: 38px; height: 38px; border-radius: 50%;
          border: 1.5px solid ${navBorderColor};
          background: transparent;
          color: ${navMutedColor};
          cursor: none;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .theme-toggle-btn:hover {
          color: ${navTextColor};
          border-color: ${navTextColor};
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
