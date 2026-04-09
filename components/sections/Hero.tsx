'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

interface HeroProps {
  title?: string;
  services?: string[];
  bgImage?: string;
  bgVideo?: string;
}

export default function Hero({
  title = 'We build digital things.',
  services = ['Web', 'Mobile', 'Design', 'Strategy'],
  bgImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  bgVideo,
}: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 70; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28, r: Math.random() * 1.4 + 0.4, o: Math.random() * 0.45 + 0.08 });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(176,198,255,${p.o})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(176,198,255,${0.055 * (1 - dist / 110)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const words = title.split(' ');
  const showVideo = !!bgVideo;

  return (
    <section className="hero-section">
      {/* Background: video takes priority over image */}
      {showVideo ? (
        <video
          ref={videoRef}
          className="hero-bg-video"
          src={bgVideo}
          autoPlay
          loop
          muted={muted}
          playsInline
        />
      ) : (
        <div className="hero-bg" style={{ backgroundImage: `url(${bgImage})` }} />
      )}

      <div className="hero-overlay" />
      <canvas ref={canvasRef} className="particle-canvas" />

      {/* Mute toggle for video */}
      {showVideo && (
        <button
          className="hero-mute-btn"
          onClick={() => {
            setMuted(m => !m);
            if (videoRef.current) videoRef.current.muted = !muted;
          }}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}

      <div className="hero-content">
        <h1 className="hero-h1">
          {words.map((word, i) => (
            <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
              <span
                className={i === 2 ? 'accent' : ''}
                style={{ display: 'inline-block', animation: `slideUp 0.85s cubic-bezier(0.16,1,0.3,1) ${0.08 + i * 0.09}s both` }}
              >
                {word}
              </span>
              {i < words.length - 1 ? '\u00a0' : ''}
            </span>
          ))}
        </h1>

        <p className="hero-sub" style={{ animation: 'fadeInUp 0.8s ease 0.6s both' }}>
          {services.map((s, i) => (
            <span key={s}>
              {s}{i < services.length - 1 && <span className="dot"> · </span>}
            </span>
          ))}
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', animation: 'fadeInUp 0.8s ease 0.78s both' }}>
          <Link href="/contact" className="btn-primary">Start a project <ArrowRight size={16} /></Link>
          <Link href="/portfolio" className="btn-outline">View our work</Link>
        </div>
      </div>

      {/* Scroll hint — centered at bottom */}
      <div className="scroll-hint">
        <span>Scroll to explore</span>
        <div className="scroll-line" />
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(110%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
