'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectDetailProps {
  project: any;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const [phase, setPhase] = useState<'entering' | 'open' | 'exiting'>('entering');
  const [galleryIdx, setGalleryIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Build gallery from cover + gallery array
  const allMedia: { type: string; url: string }[] = [];
  if (project.image) allMedia.push({ type: 'image', url: project.image });
  if (project.gallery?.length) allMedia.push(...project.gallery);

  useEffect(() => {
    const t = setTimeout(() => setPhase('open'), 50);
    document.body.style.overflow = 'hidden';
    return () => { clearTimeout(t); };
  }, []);

  const close = useCallback(() => {
    setPhase('exiting');
    setTimeout(() => {
      document.body.style.overflow = '';
      onClose();
    }, 600);
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') setGalleryIdx(i => (i + 1) % Math.max(allMedia.length, 1));
      if (e.key === 'ArrowLeft') setGalleryIdx(i => (i - 1 + Math.max(allMedia.length, 1)) % Math.max(allMedia.length, 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, allMedia.length]);

  const hero = allMedia[0];

  return (
    <div
      ref={scrollRef}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 8000,
        background: 'var(--bg)',
        overflowY: 'auto',
        overflowX: 'hidden',
        transform: phase === 'entering' ? 'translateY(100%)' : phase === 'exiting' ? 'translateY(100%)' : 'translateY(0)',
        transition: phase === 'entering'
          ? 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)'
          : phase === 'exiting'
          ? 'transform 0.55s cubic-bezier(0.55, 0, 1, 0.8)'
          : 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}
    >
      {/* Close button */}
      <button
        onClick={close}
        aria-label="Close project"
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '1.5rem',
          zIndex: 9000,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          border: '1.5px solid rgba(255,255,255,0.25)',
          color: 'white',
          cursor: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          transition: 'background 0.2s, transform 0.2s',
        }}
        className="pd-close"
      >
        <X size={18} />
      </button>

      {/* Full-bleed hero */}
      <div className="pd-hero">
        {hero && (
          hero.type === 'video' ? (
            <video
              className="pd-hero-media"
              src={hero.url}
              autoPlay
              muted
              loop
              playsInline
              style={{
                opacity: phase === 'open' ? 1 : 0,
                transition: 'opacity 0.6s ease 0.3s',
              }}
            />
          ) : (
            <img
              className="pd-hero-media"
              src={hero.url}
              alt={project.title}
              style={{
                opacity: phase === 'open' ? 1 : 0,
                transition: 'opacity 0.6s ease 0.3s',
                transform: phase === 'open' ? 'scale(1)' : 'scale(1.08)',
              }}
            />
          )
        )}
        {!hero && <div style={{ width: '100%', height: '100%', background: 'var(--surface-high)' }} />}
        <div className="pd-hero-overlay" />
        <div
          className="pd-hero-title"
          style={{
            opacity: phase === 'open' ? 1 : 0,
            transform: phase === 'open' ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.7s ease 0.25s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s',
          }}
        >
          <h1 className="pd-hero-h1">{project.title}</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {project.tags?.join('  ·  ')}
          </p>
        </div>
      </div>

      {/* Meta bar */}
      <div
        className="pd-meta-bar"
        style={{
          opacity: phase === 'open' ? 1 : 0,
          transition: 'opacity 0.5s ease 0.5s',
        }}
      >
        {project.year && (
          <div className="pd-meta-item">
            <p className="pd-meta-label">Year</p>
            <p className="pd-meta-val">{project.year}</p>
          </div>
        )}
        {project.client && (
          <div className="pd-meta-item">
            <p className="pd-meta-label">Client</p>
            <p className="pd-meta-val">{project.client}</p>
          </div>
        )}
        {project.category && (
          <div className="pd-meta-item">
            <p className="pd-meta-label">Type</p>
            <p className="pd-meta-val" style={{ textTransform: 'capitalize' }}>{project.category}</p>
          </div>
        )}
        {project.deliverables?.length > 0 && (
          <div className="pd-meta-item" style={{ flex: 1 }}>
            <p className="pd-meta-label">Deliverables</p>
            <p className="pd-meta-val">{project.deliverables.join(', ')}</p>
          </div>
        )}
        <div style={{ marginLeft: 'auto' }}>
          <Link href="/contact" onClick={close} className="btn-primary" style={{ display: 'inline-flex', fontSize: '0.85rem', padding: '0.65rem 1.6rem' }}>
            Start a project <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Body content */}
      <div
        className="pd-body"
        style={{
          opacity: phase === 'open' ? 1 : 0,
          transform: phase === 'open' ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease 0.55s, transform 0.6s ease 0.55s',
        }}
      >
        {/* Problem + Solution */}
        {(project.problem || project.solution) && (
          <div className="pd-two-col">
            {project.problem && (
              <div>
                <p className="pd-section-title">The Challenge</p>
                <p className="pd-body-text" style={{ marginBottom: 0 }}>{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div>
                <p className="pd-section-title">Our Solution</p>
                <p className="pd-body-text" style={{ marginBottom: 0 }}>{project.solution}</p>
              </div>
            )}
          </div>
        )}

        {/* Tech stack */}
        {project.stack?.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <p className="pd-section-title">Built with</p>
            <div className="pd-stack">
              {project.stack.map((t: string) => <span key={t} className="pd-chip">{t}</span>)}
            </div>
          </div>
        )}

        {/* Stats */}
        {project.stats?.length > 0 && (
          <div className="pd-stats">
            {project.stats.map((s: any) => (
              <div key={s.label}>
                <div className="pd-stat-val">{s.value}</div>
                <div className="pd-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gallery */}
      {allMedia.length > 1 && (
        <div className="pd-gallery" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 3rem 6rem' }}>
          <p className="pd-section-title" style={{ marginBottom: '2rem' }}>Gallery</p>
          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setGalleryIdx(i => (i - 1 + allMedia.length) % allMedia.length)}
              style={{ width: 40, height: 40, borderRadius: '50%', border: '1.5px solid var(--border-strong)', background: 'transparent', color: 'var(--text)', cursor: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              aria-label="Previous"
            ><ChevronLeft size={18} /></button>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-faint)' }}>{galleryIdx + 1} / {allMedia.length}</span>
            <button
              onClick={() => setGalleryIdx(i => (i + 1) % allMedia.length)}
              style={{ width: 40, height: 40, borderRadius: '50%', border: '1.5px solid var(--border-strong)', background: 'transparent', color: 'var(--text)', cursor: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              aria-label="Next"
            ><ChevronRight size={18} /></button>
          </div>
          {/* Featured gallery item */}
          <div style={{ width: '100%', marginBottom: '1.5rem', overflow: 'hidden', background: 'var(--surface-high)' }}>
            {allMedia[galleryIdx].type === 'video' ? (
              <video
                key={galleryIdx}
                src={allMedia[galleryIdx].url}
                controls
                style={{ width: '100%', display: 'block', maxHeight: '70vh', objectFit: 'contain', background: '#000' }}
              />
            ) : (
              <img
                key={galleryIdx}
                src={allMedia[galleryIdx].url}
                alt={`${project.title} ${galleryIdx + 1}`}
                style={{ width: '100%', display: 'block', maxHeight: '70vh', objectFit: 'contain', background: 'var(--surface-high)' }}
              />
            )}
          </div>
          {/* Thumbnails */}
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {allMedia.map((m, i) => (
              <div
                key={i}
                onClick={() => setGalleryIdx(i)}
                style={{ flexShrink: 0, width: 100, height: 70, overflow: 'hidden', cursor: 'none', border: `2px solid ${i === galleryIdx ? 'var(--primary)' : 'transparent'}`, borderRadius: '0.4rem', transition: 'border-color 0.2s', background: 'var(--surface-high)' }}
              >
                {m.type === 'video' ? (
                  <video src={m.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img src={m.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .pd-close:hover {
          background: rgba(255,255,255,0.22) !important;
          transform: scale(1.08) rotate(90deg) !important;
        }
        .light .pd-close {
          background: rgba(0,0,0,0.08) !important;
          border-color: rgba(0,0,0,0.2) !important;
          color: #111 !important;
        }
        @media (max-width: 768px) {
          .pd-body { padding: 3rem 1.5rem !important; }
          .pd-hero-title { padding: 2.5rem 1.5rem 2rem !important; }
          .pd-meta-bar { padding: 2rem 1.5rem !important; gap: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}
