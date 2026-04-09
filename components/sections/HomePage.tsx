'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import HMProjectGrid from './HMProjectGrid';

export default function HomePage({ settings, projects, services, testimonials }: any) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const stats = settings?.stats || [
    { value: '40', suffix: '+', label: 'Projects Delivered' },
    { value: '12', suffix: '', label: 'Countries Served' },
    { value: '150', suffix: '+', label: 'Happy Clients' },
    { value: '5', suffix: '', label: 'Years of Excellence' },
  ];

  const partnerLogos: any[] = settings?.partnerLogos || [];
  const logoTextFallback = ['GOOGLE', 'META', 'APPLE', 'NETFLIX', 'ADOBE', 'NIKE', 'STRIPE', 'NOTION'];
  const doubled = partnerLogos.length > 0 ? [...partnerLogos, ...partnerLogos] : null;

  return (
    <>
      {/* ── Services Overview ── */}
      <section className="services-section">
        <div className="section-container">
          <div className="services-grid">
            <div>
              <RevealOnScroll>
                <p className="section-label">What we do</p>
                <h2 className="section-h2">Our Core<br />Expertise</h2>
                <p style={{ marginTop: '1.25rem', fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-muted)', maxWidth: 440 }}>
                  We operate at the intersection of technical excellence and cinematic aesthetics — ensuring every pixel serves a purpose and every interaction tells a story.
                </p>
              </RevealOnScroll>
            </div>
            <div className="service-list">
              {services.map((s: any, i: number) => (
                <Link key={s._id} href="/services" className="service-item" style={{ textDecoration: 'none' }}>
                  <div className="service-left">
                    <span className="service-num">0{i + 1}</span>
                    <span className="service-name">{s.title}</span>
                  </div>
                  <ArrowUpRight size={18} className="service-arrow-icon" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Projects — Hello Monday Grid ── */}
      <section className="hm-featured-section">
        <div className="hm-featured-header">
          <div>
            <RevealOnScroll><p className="section-label">Selected work</p></RevealOnScroll>
            <RevealOnScroll delay={100}>
              <h2 className="projects-h2">Featured<br /><span>Masterpieces</span></h2>
            </RevealOnScroll>
          </div>
          <RevealOnScroll delay={200}>
            <Link href="/portfolio" className="btn-outline" style={{ display: 'inline-flex' }}>
              View all work <ArrowRight size={16} />
            </Link>
          </RevealOnScroll>
        </div>
        <HMProjectGrid projects={projects} showHeader={false} showViewAll={false} maxItems={6} />
        <div style={{ textAlign: 'center', padding: '3rem 3rem 0' }}>
          <RevealOnScroll>
            <Link href="/portfolio" className="btn-outline" style={{ display: 'inline-flex' }}>
              View all work <ArrowRight size={16} />
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            {stats.map((s: any, i: number) => (
              <RevealOnScroll key={i} delay={i * 100}>
                <div className="stat-num">{s.value}{s.suffix}</div>
                <p className="stat-label">{s.label}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials-section">
        <div className="section-container">
          <RevealOnScroll><p className="section-label">What clients say</p></RevealOnScroll>
          <RevealOnScroll delay={100}><h2 className="section-h2">Voices of<br />our partners</h2></RevealOnScroll>
          {testimonials.length > 0 && (
            <div className="testimonial-slider">
              <div className="testimonial-quote-mark">"</div>
              <p className="testimonial-text">{testimonials[activeTestimonial]?.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{testimonials[activeTestimonial]?.initials}</div>
                <div>
                  <p className="testimonial-name">{testimonials[activeTestimonial]?.name}</p>
                  <p className="testimonial-role">{testimonials[activeTestimonial]?.role}, {testimonials[activeTestimonial]?.company}</p>
                </div>
              </div>
              <div className="testimonial-controls">
                <button className="t-btn" onClick={() => setActiveTestimonial(i => (i - 1 + testimonials.length) % testimonials.length)}><ChevronLeft size={18} /></button>
                <div className="t-dots">
                  {testimonials.map((_: any, i: number) => (
                    <div key={i} className={`t-dot${i === activeTestimonial ? ' active' : ''}`} onClick={() => setActiveTestimonial(i)} style={{ cursor: 'none' }} />
                  ))}
                </div>
                <button className="t-btn" onClick={() => setActiveTestimonial(i => (i + 1) % testimonials.length)}><ChevronRight size={18} /></button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Partner Logos ── */}
      <section className="logos-section">
        <p className="logos-label">Trusted by</p>
        <div className="logos-marquee">
          <div className="logos-track">
            {doubled ? doubled.map((logo: any, i: number) => (
              <a key={i} href={logo.website || '#'} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }} title={logo.name}>
                {logo.imageUrl ? (
                  <img src={logo.imageUrl} alt={logo.name} className="logo-item-img" />
                ) : (
                  <span className="logo-item">{logo.name}</span>
                )}
              </a>
            )) : [...logoTextFallback, ...logoTextFallback].map((l, i) => (
              <span key={i} className="logo-item">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-banner">
        <RevealOnScroll><h2 className="cta-h2">Ready to build?</h2></RevealOnScroll>
        <RevealOnScroll delay={100}><p className="cta-sub">Let's create something great together.</p></RevealOnScroll>
        <RevealOnScroll delay={200}>
          <Link href="/contact" className="btn-primary" style={{ display: 'inline-flex' }}>
            Start a project <ArrowRight size={16} />
          </Link>
        </RevealOnScroll>
      </section>
    </>
  );
}
