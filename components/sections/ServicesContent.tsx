'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Monitor, Smartphone, Layers, BarChart3, Settings2, ArrowRight, Plus, Code, Globe, Palette, Database, Shield, Zap, Users } from 'lucide-react';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import AnimatedPageTitle from '@/components/ui/AnimatedPageTitle';

const ICON_MAP: Record<string, any> = {
  Monitor, Smartphone, Layers, BarChart3, Settings2, Code, Globe, Palette, Database, Shield, Zap, Users,
};

export default function ServicesContent({ services, initialOpenIndex = 0 }: { services: any[]; initialOpenIndex?: number }) {
  const [openIdx, setOpenIdx] = useState<number | null>(initialOpenIndex);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    setOpenIdx(initialOpenIndex);
  }, [initialOpenIndex]);

  return (
    <>
      <section className="page-hero">
        <div style={{ maxWidth: 1400, width: '100%', margin: '0 auto' }}>
          <p className="section-label" style={{ animation: 'fadeInUp 0.7s ease 0.05s both' }}>What we offer</p>
          <AnimatedPageTitle>What we offer.</AnimatedPageTitle>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1.5rem', maxWidth: 520, fontFamily: 'var(--font-body)', animation: 'fadeInUp 0.7s ease 0.3s both', opacity: 0 }}>
            We bring technical mastery and creative vision to every engagement — from strategy all the way to launch.
          </p>
        </div>
      </section>

      <section className="services-page">
        <div className="section-container">
          <div className="accordion-list">
            {services.map((s: any, i: number) => {
              const Icon = ICON_MAP[s.icon] || Monitor;
              const isOpen = openIdx === i;
              const isHovered = hoveredIdx === i;

              return (
                <RevealOnScroll key={s._id} delay={i * 60}>
                  <div
                    className={`accordion-item${isOpen ? ' open' : ''}`}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <div
                      className="accordion-header"
                      onClick={() => setOpenIdx(isOpen ? null : i)}
                    >
                      <div className="accordion-left">
                        <span className="accordion-num">0{i + 1}</span>
                        <div
                          className="accordion-icon-wrap"
                          style={{
                            background: isOpen || isHovered ? 'var(--accent)' : 'var(--surface-high)',
                            color: isOpen || isHovered ? '#000' : 'var(--primary)',
                            transition: 'background 0.3s, color 0.3s',
                          }}
                        >
                          <Icon size={18} />
                        </div>
                        <span
                          className="accordion-title"
                          style={{
                            color: isOpen || isHovered ? 'var(--text)' : 'var(--text)',
                            transition: 'color 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '0.25rem',
                          }}
                        >
                          {s.category && (
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', letterSpacing: '0.14em', color: 'var(--text-faint)', fontWeight: 500 }}>
                              {s.category}
                            </span>
                          )}
                          <span>{s.title}</span>
                        </span>
                      </div>
                      {/* Arrow shows green → on hover (like image 3), rotates to × when open */}
                      <div
                        style={{
                          width: 36, height: 36,
                          borderRadius: '50%',
                          border: `1.5px solid ${isOpen ? 'var(--accent)' : isHovered ? 'var(--accent)' : 'var(--border-strong)'}`,
                          background: isOpen ? 'var(--accent)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: isOpen ? '#000' : isHovered ? 'var(--accent)' : 'var(--text)',
                          transition: 'all 0.25s',
                          transform: isOpen ? 'rotate(45deg)' : isHovered ? 'rotate(0deg)' : 'rotate(-45deg)',
                          flexShrink: 0,
                          fontFamily: 'var(--font-body)',
                          fontSize: '1.4rem',
                          fontWeight: 300,
                          lineHeight: 1,
                        }}
                        aria-label={isOpen ? 'Close' : 'Open'}
                      >
                        {isOpen ? '×' : isHovered ? '→' : '↗'}
                      </div>
                    </div>
                    <div className="accordion-body">
                      <div className="accordion-body-inner">
                        <p className="accordion-desc">{s.description}</p>
                        {Array.isArray(s.items) && s.items.length > 0 && (
                          <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {s.items.map((it: string, idx: number) => (
                              <li key={idx} style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.82rem',
                                color: 'var(--text)',
                                padding: '0.4rem 0.85rem',
                                border: '1px solid var(--border-strong)',
                                borderRadius: '999px',
                                background: 'var(--surface-high)',
                              }}>{it}</li>
                            ))}
                          </ul>
                        )}
                        {s.link && (
                          <Link href={s.link} className="accordion-link">
                            {s.linkLabel || 'Learn more'} →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: '6rem 3rem', background: 'var(--surface)', textAlign: 'center' }}>
        <RevealOnScroll><p className="section-label" style={{ display: 'block' }}>Our work</p></RevealOnScroll>
        <RevealOnScroll delay={100}><h2 className="section-h2" style={{ marginBottom: '2rem' }}>See it in action.</h2></RevealOnScroll>
        <RevealOnScroll delay={200}>
          <Link href="/portfolio" className="btn-outline" style={{ display: 'inline-flex' }}>
            View our work <ArrowRight size={16} />
          </Link>
        </RevealOnScroll>
      </section>

      <section className="cta-banner">
        <RevealOnScroll><h2 className="cta-h2">Let's talk about<br />your project.</h2></RevealOnScroll>
        <RevealOnScroll delay={100}><p className="cta-sub">Tell us what you're building and we'll tell you how we can help.</p></RevealOnScroll>
        <RevealOnScroll delay={200}>
          <Link href="/contact" className="btn-primary" style={{ display: 'inline-flex' }}>
            Request a quote <ArrowRight size={16} />
          </Link>
        </RevealOnScroll>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .accordion-item {
          border-left: 3px solid transparent;
          padding-left: 0;
          transition: border-left-color 0.25s ease, padding-left 0.25s ease, background 0.25s ease;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .accordion-item:hover {
          border-left-color: var(--accent);
          padding-left: 1rem;
          background: rgba(0,255,135,0.03);
        }
        .accordion-item.open {
          border-left-color: var(--accent);
          padding-left: 1rem;
          background: rgba(0,255,135,0.04);
        }
      `}</style>
    </>
  );
}
