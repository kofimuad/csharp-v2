'use client';
import Link from 'next/link';
import { Linkedin, Twitter, Instagram, Dribbble, ArrowRight } from 'lucide-react';
import { useState } from 'react';

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
  };
}

export default function Footer({ settings }: FooterProps) {
  const [email, setEmail] = useState('');

  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="footer-logo">{settings?.agencyName || 'C#'}</div>
          <p className="footer-tagline">{settings?.footerTagline || 'We build digital things. Premium tech agency crafting cinematic digital experiences for brands that demand excellence.'}</p>
          <p className="footer-contact-info">
            {settings?.address || '25 Independence Ave, Accra, Ghana'}<br/>
            {settings?.phone || '+233 30 000 0000'}<br/>
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
              { href: settings?.linkedinUrl || '#', icon: <Linkedin size={16}/>, label: 'LinkedIn' },
              { href: settings?.twitterUrl || '#', icon: <Twitter size={16}/>, label: 'Twitter' },
              { href: settings?.instagramUrl || '#', icon: <Instagram size={16}/>, label: 'Instagram' },
              { href: settings?.dribbbleUrl || '#', icon: <Dribbble size={16}/>, label: 'Dribbble' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener" className="social-link" aria-label={s.label}>{s.icon}</a>
            ))}
          </div>
          <p className="footer-col-title" style={{marginTop:'1.5rem'}}>Newsletter</p>
          <div className="newsletter-form">
            <input
              type="email"
              className="newsletter-input"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button className="newsletter-btn" aria-label="Subscribe"><ArrowRight size={16}/></button>
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
