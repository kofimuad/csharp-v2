'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import AnimatedPageTitle from '@/components/ui/AnimatedPageTitle';
import HMProjectGrid from './HMProjectGrid';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'web', label: 'Web' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'design', label: 'Design' },
  { key: 'consulting', label: 'Consulting' },
];

export default function PortfolioContent({ projects, testimonials }: { projects: any[]; testimonials: any[] }) {
  const [filter, setFilter] = useState('all');
  const [activeT, setActiveT] = useState(0);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <>
      <section className="page-hero">
        <div style={{ maxWidth: 1400, width: '100%', margin: '0 auto' }}>
          <p className="section-label" style={{ animation: 'fadeInUp 0.7s ease 0.05s both' }}>Portfolio</p>
          <AnimatedPageTitle>Selected <span className="accent">work.</span></AnimatedPageTitle>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1.5rem', fontFamily: 'var(--font-body)', animation: 'fadeInUp 0.7s ease 0.3s both', opacity: 0 }}>
            A look at what we've built.
          </p>
        </div>
      </section>

      <section className="hm-projects-section">
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 3rem 2rem' }}>
          <div className="filter-bar">
            {FILTERS.map(f => (
              <button key={f.key} className={`filter-btn${filter === f.key ? ' active' : ''}`} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <HMProjectGrid projects={filtered} showHeader={false} showViewAll={false} />
      </section>

      {testimonials.length > 0 && (
        <section className="testimonials-section">
          <div className="section-container">
            <RevealOnScroll><p className="section-label">Client voices</p></RevealOnScroll>
            <RevealOnScroll delay={100}><h2 className="section-h2">What our clients say.</h2></RevealOnScroll>
            <div className="testimonial-slider">
              <div className="testimonial-quote-mark">"</div>
              <p className="testimonial-text">{testimonials[activeT]?.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{testimonials[activeT]?.initials}</div>
                <div>
                  <p className="testimonial-name">{testimonials[activeT]?.name}</p>
                  <p className="testimonial-role">{testimonials[activeT]?.role}, {testimonials[activeT]?.company}</p>
                </div>
              </div>
              <div className="testimonial-controls">
                <button className="t-btn" onClick={() => setActiveT(i => (i - 1 + testimonials.length) % testimonials.length)}><ChevronLeft size={18} /></button>
                <div className="t-dots">
                  {testimonials.map((_: any, i: number) => (
                    <div key={i} className={`t-dot${i === activeT ? ' active' : ''}`} onClick={() => setActiveT(i)} style={{ cursor: 'none' }} />
                  ))}
                </div>
                <button className="t-btn" onClick={() => setActiveT(i => (i + 1) % testimonials.length)}><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="cta-banner">
        <RevealOnScroll><h2 className="cta-h2">Have a project in mind?</h2></RevealOnScroll>
        <RevealOnScroll delay={100}><p className="cta-sub">Let's build something incredible together.</p></RevealOnScroll>
        <RevealOnScroll delay={200}>
          <Link href="/contact" className="btn-primary" style={{ display: 'inline-flex' }}>
            Let's talk <ArrowRight size={16} />
          </Link>
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
