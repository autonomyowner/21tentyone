'use client';

import { useState, useEffect } from 'react';

interface ArtisticT21Props {
  scrolled?: boolean;
  className?: string;
}

export default function ArtisticT21({ scrolled = false, className = '' }: ArtisticT21Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style jsx>{`
        .t21-artistic {
          position: relative;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          letter-spacing: -0.02em;
        }

        .t21-number {
          position: relative;
          z-index: 2;
        }

        .t21-splatter {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.6s ease-out;
        }

        .t21-artistic:hover .t21-splatter {
          opacity: 1;
        }

        @keyframes subtle-morph {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
          }
        }

        .t21-splatter svg {
          animation: subtle-morph 6s ease-in-out infinite;
        }
      `}</style>

      <div className={`t21-artistic ${className}`}>
        {/* Abstract paint splatter background - only shows on hover */}
        <div className="t21-splatter">
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
            <path
              d="M20 40 Q40 20 60 35 Q80 25 100 40 Q85 60 60 45 Q40 65 20 40 Z"
              fill={scrolled ? 'rgba(186, 84, 72, 0.15)' : 'rgba(157, 67, 58, 0.12)'}
            />
            <circle cx="90" cy="25" r="4" fill={scrolled ? 'rgba(186, 84, 72, 0.2)' : 'rgba(157, 67, 58, 0.15)'} />
            <circle cx="105" cy="35" r="3" fill={scrolled ? 'rgba(186, 84, 72, 0.2)' : 'rgba(157, 67, 58, 0.15)'} />
          </svg>
        </div>

        {/* The artistic T21 text */}
        <span className="t21-number" style={{
          backgroundImage: scrolled
            ? 'linear-gradient(135deg, #FBE9E7 0%, #BA5448 100%)'
            : 'linear-gradient(135deg, #81352E 0%, #9D433A 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          T21
        </span>
      </div>
    </>
  );
}
