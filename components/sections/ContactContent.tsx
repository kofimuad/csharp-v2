'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Linkedin, Twitter, Instagram, Dribbble, ArrowRight, CheckCircle } from 'lucide-react';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import AnimatedPageTitle from '@/components/ui/AnimatedPageTitle';

export default function ContactContent({ settings }: { settings: any }) {
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setForm({ name: '', email: '', service: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const address = settings?.address || '25 Independence Ave, Accra, Ghana';
  const phone = settings?.phone || '+233 30 000 0000';
  const email = settings?.email || 'hello@csharp.agency';
  const hours = settings?.hours || 'Monday – Friday, 8:00 AM – 6:00 PM GMT';
  const calendly = settings?.calendlyUrl || 'https://calendly.com';

  const socials = [
    { href: settings?.linkedinUrl || '#', icon: <Linkedin size={16} />, label: 'LinkedIn' },
    { href: settings?.twitterUrl || '#', icon: <Twitter size={16} />, label: 'Twitter' },
    { href: settings?.instagramUrl || '#', icon: <Instagram size={16} />, label: 'Instagram' },
    { href: settings?.dribbbleUrl || '#', icon: <Dribbble size={16} />, label: 'Dribbble' },
  ];

  return (
    <>
      <section className="page-hero">
        <div style={{ maxWidth: 1400, width: '100%', margin: '0 auto' }}>
          <AnimatedPageTitle>Let's build<br /><span className="accent">something.</span></AnimatedPageTitle>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1.5rem', maxWidth: 480, fontFamily: 'var(--font-body)' }}>
            Tell us about your project and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="section-container">
          <div className="contact-grid">

            {/* Form */}
            <div>
              {status === 'success' ? (
                <div style={{ padding: '3rem', background: 'var(--surface-high)', borderRadius: '1.25rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <CheckCircle size={48} style={{ color: 'var(--accent)', marginBottom: '1.25rem' }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)', marginBottom: '0.75rem' }}>Message sent!</h3>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button onClick={() => setStatus('idle')} className="btn-outline" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-field">
                    <label className="form-label" htmlFor="name">Your Name</label>
                    <input id="name" type="text" className="form-input" placeholder="Ama Mensah" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input id="email" type="email" className="form-input" placeholder="ama@company.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="service">Service Interest</label>
                    <select id="service" className="form-select" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                      <option value="" disabled>Select a service</option>
                      <option value="web">Web Development</option>
                      <option value="mobile">Mobile App Development</option>
                      <option value="design">UX / UI Design</option>
                      <option value="consulting">Business &amp; Tech Consulting</option>
                      <option value="support">IT Support &amp; Maintenance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="message">Your Message</label>
                    <textarea id="message" className="form-textarea" placeholder="Tell us about your project — what you're building, your timeline, and what success looks like." required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  {status === 'error' && (
                    <p style={{ color: '#ff6b6b', fontFamily: 'var(--font-body)', fontSize: '0.85rem', marginBottom: '1rem' }}>{errorMsg}</p>
                  )}
                  <button type="submit" className="form-submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Sending…' : 'Send it →'}
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <RevealOnScroll>
              <div className="contact-info">
                <h3>Find us</h3>

                {[
                  { icon: <MapPin size={18} />, label: 'Address', content: address },
                  { icon: <Phone size={18} />, label: 'Phone', content: phone },
                  { icon: <Mail size={18} />, label: 'Email', content: email },
                  { icon: <Clock size={18} />, label: 'Hours', content: hours },
                ].map(d => (
                  <div key={d.label} className="contact-detail">
                    <div className="contact-detail-icon">{d.icon}</div>
                    <div>
                      <p className="contact-detail-label">{d.label}</p>
                      <p>{d.content}</p>
                    </div>
                  </div>
                ))}

                <div className="contact-socials" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                  {socials.map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener" className="social-link" aria-label={s.label}>
                      {s.icon}
                    </a>
                  ))}
                </div>

                {/* Google Maps embed - Accra, Ghana */}
                <div className="contact-map">
                  <iframe
                    title="C Sharp Agency Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127521.77788900855!2d-0.2698282!3d5.5912898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sAccra%2C%20Ghana!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                    width="100%"
                    height="240"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="consult-cta">
        <RevealOnScroll><p className="section-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Book a call</p></RevealOnScroll>
        <RevealOnScroll delay={100}><h3 className="consult-h3">Prefer a call?</h3></RevealOnScroll>
        <RevealOnScroll delay={150}><p className="consult-sub">Book a free 30-minute consultation — no pressure, just a conversation.</p></RevealOnScroll>
        <RevealOnScroll delay={200}>
          <a href={calendly} target="_blank" rel="noopener" className="btn-primary" style={{ display: 'inline-flex' }}>
            Schedule a consultation <ArrowRight size={16} />
          </a>
        </RevealOnScroll>
      </section>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
