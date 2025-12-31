'use client';

import { useEffect, useState } from 'react';
import { MILESTONES } from '@/lib/healing-mock-data';

interface MilestoneCelebrationProps {
  milestone: 7 | 14 | 21;
  isOpen: boolean;
  onClose: () => void;
  completedDaysCount: number;
  completedTasksCount: number;
}

function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    setStyle({
      left: `${Math.random() * 100}%`,
      animationDelay: `${delay}ms`,
      backgroundColor: color,
      width: `${8 + Math.random() * 8}px`,
      height: `${8 + Math.random() * 8}px`,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
    });
  }, [delay, color]);

  return (
    <div
      className="absolute confetti-particle"
      style={style}
    />
  );
}

export function MilestoneCelebration({
  milestone,
  isOpen,
  onClose,
  completedDaysCount,
  completedTasksCount,
}: MilestoneCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const milestoneData = MILESTONES.find((m) => m.day === milestone);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setShowContent(true), 100);
    } else {
      setShowContent(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible || !milestoneData) return null;

  const colors = ['#81352E', '#9D433A', '#BA5448', '#E6C8C3', '#FBE9E7'];

  const getMilestoneGradient = () => {
    switch (milestone) {
      case 7:
        return 'linear-gradient(135deg, #81352E 0%, #9D433A 100%)';
      case 14:
        return 'linear-gradient(135deg, #9D433A 0%, #E6C8C3 100%)';
      case 21:
        return 'linear-gradient(135deg, #81352E 0%, #9D433A 50%, #BA5448 100%)';
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-opacity duration-300 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backgroundColor: 'rgba(129, 53, 46, 0.6)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      {/* Confetti container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <ConfettiParticle
            key={i}
            delay={i * 60}
            color={colors[i % colors.length]}
          />
        ))}
      </div>

      {/* Modal */}
      <div
        className={`relative w-full max-w-md overflow-hidden transition-all duration-500 ${
          showContent ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        style={{
          backgroundColor: 'var(--cream)',
          boxShadow: '0 32px 64px rgba(129, 53, 46, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div
          className="relative px-8 pt-12 pb-16 text-center overflow-hidden"
          style={{ background: getMilestoneGradient() }}
        >
          {/* Decorative circles */}
          <div
            className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-10"
            style={{
              background: '#fff',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-10"
            style={{
              background: '#fff',
              transform: 'translate(30%, 50%)',
            }}
          />

          {/* Milestone number */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 mb-4"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span className="heading-serif text-4xl text-white">{milestone}</span>
          </div>

          <h2 className="heading-serif text-2xl font-light text-white mb-2">
            {milestoneData.title}
          </h2>
          <p className="text-white/80 text-sm tracking-wide">
            {milestoneData.subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-8 text-center">
          <p
            className="heading-serif text-lg font-light leading-relaxed mb-8"
            style={{ color: 'var(--navy)' }}
          >
            {milestoneData.message}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <span
                className="block heading-serif text-3xl"
                style={{ color: 'var(--navy)' }}
              >
                {completedDaysCount}
              </span>
              <span className="text-xs" style={{ color: 'var(--blue)' }}>
                Days Completed
              </span>
            </div>
            <div
              className="w-px"
              style={{ backgroundColor: 'rgba(129, 53, 46, 0.1)' }}
            />
            <div className="text-center">
              <span
                className="block heading-serif text-3xl"
                style={{ color: 'var(--navy)' }}
              >
                {completedTasksCount}
              </span>
              <span className="text-xs" style={{ color: 'var(--blue)' }}>
                Exercises Done
              </span>
            </div>
          </div>

          {/* Achievement badge */}
          <div
            className="inline-block px-6 py-3 mb-8"
            style={{
              backgroundColor: 'rgba(186, 84, 72, 0.12)',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--gold)' }}>
              {milestoneData.achievement}
            </p>
          </div>

          {/* Continue button */}
          <button
            onClick={onClose}
            className="w-full py-4 font-medium text-sm transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
            style={{
              background: 'var(--gold)',
              color: 'var(--navy)',
              boxShadow: '0 8px 24px rgba(186, 84, 72, 0.3)',
            }}
          >
            Continue Your Journey
          </button>
        </div>
      </div>

      {/* CSS for confetti animation */}
      <style jsx global>{`
        @keyframes confettiDrop {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .confetti-particle {
          position: absolute;
          top: 0;
          animation: confettiDrop 3.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
