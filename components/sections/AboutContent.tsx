'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import AnimatedPageTitle from '@/components/ui/AnimatedPageTitle';

export default function AboutContent({ about }: { about: any }) {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);
  const quotes = about?.quotes || ['"An interface should disappear in favour of the content."'];

  useEffect(() => {
    if (quotes.length <= 1) return;
    const interval = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setQuoteIdx(i => (i + 1) % quotes.length);
        setQuoteVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const stats = about?.stats || [
    { value: '40', suffix: '+', label: 'Projects Delivered' },
    { value: '12', suffix: '', label: 'Countries Served' },
    { value: '150', suffix: '+', label: 'Happy Clients' },
    { value: '5', suffix: '', label: 'Years of Excellence' },
  ];

  return (
    <>
      <section className="page-hero">
        <div style={{ maxWidth:1400, width:'100%', margin:'0 auto' }}>
          <p className="section-label" style={{ animation: 'fadeInUp 0.7s ease 0.05s both' }}>Our story</p>
          <AnimatedPageTitle>
            We are <span className="accent">C Sharp.</span><br/>We make ideas ship.
          </AnimatedPageTitle>
        </div>
      </section>

      <section style={{ background:'var(--bg)' }}>
        <div className="about-grid">
          <div className="about-body">
            {(about?.body || []).map((p: string, i: number) => (
              <RevealOnScroll key={i} delay={i * 80}><p>{p}</p></RevealOnScroll>
            ))}
          </div>
          <div className="sticky-quote">
            <div className="pull-quote">
              <p className="pull-quote-text" style={{ opacity: quoteVisible ? 1 : 0 }}>{quotes[quoteIdx]}</p>
              <p className="pull-quote-attr">— The Digital Auteur Philosophy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="vm-section">
        <div className="section-container">
          <RevealOnScroll><p className="section-label">Who we are</p></RevealOnScroll>
          <RevealOnScroll delay={100}><h2 className="section-h2">Built on purpose.</h2></RevealOnScroll>
          <div className="vm-grid">
            <RevealOnScroll>
              <div className="vm-card">
                <p className="vm-card-title">Our Vision</p>
                <p className="vm-card-text">{about?.vision || 'To be the agency that proves African tech talent can compete with — and surpass — anyone in the world.'}</p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={150}>
              <div className="vm-card">
                <p className="vm-card-title">Our Mission</p>
                <p className="vm-card-text">{about?.mission || 'To craft digital experiences that move people — emotionally, aesthetically, and commercially.'}</p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="stats-section" style={{ background:'var(--bg)' }}>
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

      <section className="cta-banner">
        <RevealOnScroll><h2 className="cta-h2">Want to work with us?</h2></RevealOnScroll>
        <RevealOnScroll delay={100}><p className="cta-sub">We'd love to hear about your project.</p></RevealOnScroll>
        <RevealOnScroll delay={200}>
          <Link href="/contact" className="btn-primary" style={{ display:'inline-flex' }}>
            Get in touch <ArrowRight size={16}/>
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
