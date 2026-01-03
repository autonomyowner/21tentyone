'use client';

import { useEffect, useState } from 'react';

// Paint Splatter SVG Component
export function PaintSplatter({
  className,
  color,
  delay = 0,
  scale = 1
}: {
  className?: string;
  color: string;
  delay?: number;
  scale?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <svg
      className={`absolute transition-all duration-1000 ease-out pointer-events-none ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `scale(${isVisible ? scale : 0})`,
        filter: 'blur(0.5px)'
      }}
      viewBox="0 0 200 200"
      fill="none"
    >
      <path
        d="M100 10 Q130 30 150 20 Q180 40 170 70 Q190 100 160 120 Q180 150 150 160 Q130 190 100 180 Q70 200 50 170 Q20 160 30 130 Q10 100 40 80 Q20 50 50 40 Q70 10 100 10 Z"
        fill={color}
        className="animate-morph"
      />
      <circle cx="160" cy="35" r="8" fill={color} className="animate-pulse-slow" />
      <circle cx="180" cy="60" r="5" fill={color} style={{ animationDelay: '0.2s' }} />
      <circle cx="30" cy="150" r="6" fill={color} style={{ animationDelay: '0.4s' }} />
      <circle cx="170" cy="140" r="4" fill={color} style={{ animationDelay: '0.3s' }} />
    </svg>
  );
}

// Floating Gold Rectangle
export function GoldRect({
  className,
  size = 'md',
  delay = 0
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
}) {
  const sizes = {
    sm: 'w-6 h-10',
    md: 'w-10 h-16',
    lg: 'w-14 h-24'
  };

  return (
    <div
      className={`absolute ${sizes[size]} animate-float-gold pointer-events-none ${className}`}
      style={{
        background: 'linear-gradient(135deg, #BA5448 0%, #C1918C 50%, #BA5448 100%)',
        animationDelay: `${delay}s`,
        boxShadow: '0 8px 32px rgba(186, 84, 72, 0.3)'
      }}
    />
  );
}

// Grain Overlay - lightweight version
export function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 opacity-[0.06]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// Custom Cursor - only for desktop
export function CustomCursor({ mousePos }: { mousePos: { x: number; y: number } }) {
  return (
    <>
      <div
        className="fixed w-10 h-10 rounded-full pointer-events-none z-[100] hidden md:block mix-blend-difference"
        style={{
          left: mousePos.x - 20,
          top: mousePos.y - 20,
          border: '1px solid var(--gold)',
          transition: 'transform 0.1s ease-out',
        }}
      />
      <div
        className="fixed w-2 h-2 rounded-full pointer-events-none z-[100] hidden md:block"
        style={{
          left: mousePos.x - 4,
          top: mousePos.y - 4,
          background: 'var(--gold)',
        }}
      />
    </>
  );
}
