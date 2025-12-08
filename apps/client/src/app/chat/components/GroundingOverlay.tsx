'use client';

import { useState, useEffect } from 'react';

interface GroundingOverlayProps {
  onDismiss: () => void;
}

export function GroundingOverlay({ onDismiss }: GroundingOverlayProps) {
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const phases = [
      { phase: 'in' as const, duration: 4000 },
      { phase: 'hold' as const, duration: 4000 },
      { phase: 'out' as const, duration: 4000 },
    ];
    let phaseIndex = 0;
    let countdownInterval: NodeJS.Timeout;

    const updateCountdown = () => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 4));
    };

    const cyclePhases = () => {
      setBreathPhase(phases[phaseIndex].phase);
      setCountdown(4);
      countdownInterval = setInterval(updateCountdown, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
        phaseIndex = (phaseIndex + 1) % phases.length;
        cyclePhases();
      }, phases[phaseIndex].duration);
    };

    cyclePhases();

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  const getBreathText = () => {
    switch (breathPhase) {
      case 'in':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'out':
        return 'Breathe Out';
    }
  };

  return (
    <div className="grounding-overlay">
      <div className="grounding-circle">
        <div className="text-center">
          <div className="text-2xl mb-1">{countdown}</div>
          <div className="text-sm">{getBreathText()}</div>
        </div>
      </div>

      <div className="grounding-text">
        <p className="mb-4">
          Take a moment to ground yourself. Follow the breathing circle above.
        </p>
        <p className="text-[var(--text-muted)] text-sm">
          Notice 5 things you can see around you. Feel your feet firmly on the
          ground. You are safe in this present moment.
        </p>
      </div>

      <button
        onClick={onDismiss}
        className="mt-8 px-6 py-3 bg-[var(--matcha-500)] text-white rounded-[var(--radius-md)] font-medium hover:bg-[var(--matcha-600)] transition-colors"
      >
        I feel grounded
      </button>
    </div>
  );
}
