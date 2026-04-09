'use client';
import Link from 'next/link';
import { Linkedin, Twitter, Instagram, Dribbble, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

interface FooterProps {
  settings?: {
    agencyName?: string;
    footerTagline?: string;
    address?: string;
    phone?: string;
    email?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    instagramUrl?: string;
    dribbbleUrl?: string;
    logoUrl?: string;
    logoText?: string;
  };
}

// SVG logo for C# Agency - white by default, inverts to dark in light mode
function LogoMark({ light }: { light: boolean }) {
  const color = light ? '#0d0d0d' : '#ffffff';
  return (
    <svg
      width="120"
      height="40"
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* C letter */}
      <path
        d="M28 8C21.4 8 16 13.4 16 20C16 26.6 21.4 32 28 32C31.8 32 35.2 30.2 37.4 27.4L33.8 24.8C32.4 26.6 30.3 27.8 28 27.8C23.8 27.8 20.2 24.2 20.2 20C20.2 15.8 23.8 12.2 28 12.2C30.3 12.2 32.4 13.4 33.8 15.2L37.4 12.6C35.2 9.8 31.8 8 28 8Z"
        fill={color}
      />
      {/* Hash / sharp symbol */}
      <path
        d="M52 14H55.5V18H59V14H62.5V18H65V21H62.5V25H65V28H62.5V32H59V28H55.5V32H52V28H49.5V25H52V21H49.5V18H52V14ZM55.5 21V25H59V21H55.5Z"
        fill={color}
      />
      {/* Agency text */}
      <text
        x="72"
        y="22"
        fontFamily="'Inter', sans-serif"
        fontSize="11"
        fontWeight="500"
        letterSpacing="0.12em"
        fill={color}
        opacity="0.7"
      >
        AGENCY
      </text>
    </svg>
  );
}

export default function Footer({ settings }: FooterProps) {
  const [email, setEmail] = useState('');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <footer>
      <div className="footer-grid">
        <div>
          {/* Logo */}
          <div style={{ marginBottom: '1rem' }}>
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings?.logoText || settings?.agencyName || 'C# Agency'}
                style={{
                  height: 40,
                  width: 'auto',
                  objectFit: 'contain',
                  maxWidth: 180,
                  filter: isLight ? 'brightness(0)' : 'brightness(1)',
                  transition: 'filter 0.3s ease',
                }}
              />
            ) : (
              <LogoMark light={isLight} />
            )}
          </div>
          <p className="footer-tagline">{settings?.footerTagline || 'We build digital things. Premium tech agency crafting cinematic digital experiences for brands that demand excellence.'}</p>
          <p className="footer-contact-info">
            {settings?.address || '25 Independence Ave, Accra, Ghana'}<br />
            {settings?.phone || '+233 30 000 0000'}<br />
            {settings?.email || 'hello@csharp.agency'}
          </p>
        </div>
        <div>
          <p className="footer-col-title">Navigate</p>
          <ul className="footer-links">
            <li><Link href="/">Work</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/portfolio">Portfolio</Link></li>
          </ul>
        </div>
        <div>
          <p className="footer-col-title">Connect</p>
          <div className="footer-social">
            {[
              { href: settings?.linkedinUrl || '#', icon: <Linkedin size={16} />, label: 'LinkedIn' },
              { href: settings?.twitterUrl || '#', icon: <Twitter size={16} />, label: 'Twitter' },
              { href: settings?.instagramUrl || '#', icon: <Instagram size={16} />, label: 'Instagram' },
              { href: settings?.dribbbleUrl || '#', icon: <Dribbble size={16} />, label: 'Dribbble' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener" className="social-link" aria-label={s.label}>{s.icon}</a>
            ))}
          </div>
          <p className="footer-col-title" style={{ marginTop: '1.5rem' }}>Newsletter</p>
          <div className="newsletter-form">
            <input
              type="email"
              className="newsletter-input"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button className="newsletter-btn" aria-label="Subscribe"><ArrowRight size={16} /></button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {settings?.agencyName || 'C Sharp'} Agency. All rights reserved.</span>
        <span>Built with precision in Ghana.</span>
      </div>
    </footer>
  );
}
