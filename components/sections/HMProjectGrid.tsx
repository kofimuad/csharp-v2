'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import ProjectDetail from './ProjectDetail';

interface HMProjectGridProps {
  projects: any[];
  showViewAll?: boolean;
  maxItems?: number;
}

export default function HMProjectGrid({ projects, showViewAll = true, maxItems }: HMProjectGridProps) {
  const [selected, setSelected] = useState<any>(null);
  const items = maxItems ? projects.slice(0, maxItems) : projects;

  return (
    <>
      <div className="hm-grid">
        {items.map((p: any, i: number) => (
          <HMCard key={p._id} project={p} index={i} onClick={() => setSelected(p)} />
        ))}
      </div>

      {showViewAll && (
        <div style={{ textAlign: 'center', padding: '4rem 3rem 0' }}>
          <Link href="/portfolio" className="btn-outline">
            View all work <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {selected && (
        <ProjectDetail project={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function HMCard({ project, index, onClick }: { project: any; index: number; onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const isHovering = useRef(false);

  useEffect(() => {
    const card = cardRef.current;
    const img = imgRef.current;
    if (!card || !img) return;

    const MAX_MOVE = 18; // px magnetic pull

    const onMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      // Centre of card
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Normalised offset from centre (-1 to 1)
      const nx = (e.clientX - cx) / (rect.width / 2);
      const ny = (e.clientY - cy) / (rect.height / 2);
      targetX.current = nx * MAX_MOVE;
      targetY.current = ny * MAX_MOVE;
    };

    const onEnter = () => {
      isHovering.current = true;
      const animate = () => {
        if (!isHovering.current) return;
        currentX.current += (targetX.current - currentX.current) * 0.1;
        currentY.current += (targetY.current - currentY.current) * 0.1;
        img.style.transform = `translate(${currentX.current}px, ${currentY.current}px) scale(1.07)`;
        rafRef.current = requestAnimationFrame(animate);
      };
      animate();
    };

    const onLeave = () => {
      isHovering.current = false;
      cancelAnimationFrame(rafRef.current);
      targetX.current = 0;
      targetY.current = 0;
      // Spring back
      const springBack = () => {
        currentX.current += (0 - currentX.current) * 0.12;
        currentY.current += (0 - currentY.current) * 0.12;
        img.style.transform = `translate(${currentX.current}px, ${currentY.current}px) scale(1.02)`;
        if (Math.abs(currentX.current) > 0.05 || Math.abs(currentY.current) > 0.05) {
          rafRef.current = requestAnimationFrame(springBack);
        } else {
          img.style.transform = 'translate(0,0) scale(1.02)';
        }
      };
      springBack();
    };

    card.addEventListener('mousemove', onMouseMove, { passive: true });
    card.addEventListener('mouseenter', onEnter, { passive: true });
    card.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <RevealOnScroll delay={(index % 3) * 90}>
      <div ref={cardRef} className="hm-card" onClick={onClick}>
        <div className="hm-card-img">
          {/* Inner wrapper handles the magnetic transform; outer clips overflow */}
          <div ref={imgRef} style={{ width: '100%', height: '100%', transform: 'translate(0,0) scale(1.02)', transition: 'transform 0s', willChange: 'transform' }}>
            <img
              src={project.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'}
              alt={project.title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
        <div className="hm-card-body">
          <h3 className="hm-card-title">
            <span className="hm-bullet">•</span>
            {project.title}
          </h3>
          <div className="hm-card-tags">
            {project.tags?.map((t: string) => (
              <span key={t} className="hm-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}
