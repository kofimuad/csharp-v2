'use client';
import { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2';
}

// Wraps every word in an overflow:hidden span so words slide up on mount
export default function AnimatedPageTitle({ children, className = 'page-hero-h1', as: Tag = 'h1' }: Props) {
  // We animate using CSS only — class triggers on mount
  return (
    <Tag className={className} style={{ overflow: 'visible' }}>
      <span className="anim-title-inner" style={{ display: 'block', animation: 'slideUpPage 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
        {children}
      </span>
    </Tag>
  );
}
