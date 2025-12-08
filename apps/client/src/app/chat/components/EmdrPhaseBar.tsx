'use client';

import { EmdrPhase, EMDR_PHASES_ORDER, EMDR_PHASE_LABELS } from '../../../lib/api';

interface EmdrPhaseBarProps {
  currentPhase: EmdrPhase;
  onPhaseClick?: (phase: EmdrPhase) => void;
}

export function EmdrPhaseBar({ currentPhase, onPhaseClick }: EmdrPhaseBarProps) {
  const currentIndex = EMDR_PHASES_ORDER.indexOf(currentPhase);

  // Don't show COMPLETED in the progress bar
  const displayPhases = EMDR_PHASES_ORDER.slice(0, -1);

  return (
    <div className="emdr-phase-bar">
      {displayPhases.map((phase, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div
            key={phase}
            className={`emdr-phase-segment ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
            title={EMDR_PHASE_LABELS[phase]}
            onClick={() => onPhaseClick?.(phase)}
            style={{ cursor: onPhaseClick ? 'pointer' : 'default' }}
          />
        );
      })}
    </div>
  );
}

interface EmdrPhaseBarWithLabelsProps extends EmdrPhaseBarProps {
  showLabels?: boolean;
}

export function EmdrPhaseBarWithLabels({
  currentPhase,
  onPhaseClick,
  showLabels = true,
}: EmdrPhaseBarWithLabelsProps) {
  const currentIndex = EMDR_PHASES_ORDER.indexOf(currentPhase);
  const displayPhases = EMDR_PHASES_ORDER.slice(0, -1);

  return (
    <div className="space-y-2">
      <div className="emdr-phase-bar">
        {displayPhases.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={phase}
              className={`emdr-phase-segment ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              title={EMDR_PHASE_LABELS[phase]}
              onClick={() => onPhaseClick?.(phase)}
              style={{ cursor: onPhaseClick ? 'pointer' : 'default' }}
            />
          );
        })}
      </div>

      {showLabels && (
        <div className="flex justify-between px-2">
          {displayPhases.map((phase, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <span
                key={phase}
                className={`text-xs font-medium ${
                  isCurrent
                    ? 'text-[var(--matcha-600)]'
                    : isCompleted
                    ? 'text-[var(--matcha-500)]'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                {EMDR_PHASE_LABELS[phase]}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
