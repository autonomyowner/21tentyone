'use client';

import { useRef, useEffect } from 'react';
import { WEEK_PHASES } from '@/lib/healing-mock-data';

interface MilestoneTimelineProps {
  currentDay: number;
  completedDays: number[];
  onDayClick?: (day: number) => void;
}

export function MilestoneTimeline({
  currentDay,
  completedDays,
  onDayClick,
}: MilestoneTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentDayRef = useRef<HTMLButtonElement>(null);

  const milestones = [7, 14, 21];

  const getWeekPhase = (day: number): keyof typeof WEEK_PHASES => {
    if (day <= 7) return 'awareness';
    if (day <= 14) return 'healing';
    return 'integration';
  };

  const getWeekLabel = (day: number): string => {
    if (day === 4) return 'Awareness';
    if (day === 11) return 'Healing';
    if (day === 18) return 'Integration';
    return '';
  };

  useEffect(() => {
    if (currentDayRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const element = currentDayRef.current;
      const containerWidth = container.offsetWidth;
      const elementLeft = element.offsetLeft;
      const elementWidth = element.offsetWidth;

      container.scrollTo({
        left: elementLeft - containerWidth / 2 + elementWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [currentDay]);

  return (
    <div className="w-full">
      {/* Week labels */}
      <div className="flex justify-between mb-4 px-4">
        {Object.entries(WEEK_PHASES).map(([key, phase]) => (
          <div key={key} className="text-center flex-1">
            <span
              className="text-xs font-medium tracking-wider uppercase"
              style={{ color: phase.color }}
            >
              {phase.label}
            </span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide pb-4"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex items-center gap-1 px-8 min-w-max">
          {Array.from({ length: 21 }, (_, i) => i + 1).map((day) => {
            const isCompleted = completedDays.includes(day);
            const isCurrent = day === currentDay;
            const isMilestone = milestones.includes(day);
            const isFuture = day > currentDay;
            const weekLabel = getWeekLabel(day);
            const phase = getWeekPhase(day);

            return (
              <div key={day} className="relative flex flex-col items-center">
                {/* Week label */}
                {weekLabel && (
                  <span
                    className="absolute -top-6 text-xs font-medium whitespace-nowrap"
                    style={{ color: WEEK_PHASES[phase].color }}
                  >
                    Week {Math.ceil(day / 7)}
                  </span>
                )}

                {/* Connector line */}
                {day > 1 && (
                  <div
                    className="absolute right-full top-1/2 -translate-y-1/2 h-0.5"
                    style={{
                      width: '4px',
                      backgroundColor: isCompleted || isCurrent
                        ? WEEK_PHASES[phase].color
                        : 'rgba(26, 46, 74, 0.15)',
                      transition: 'background-color 0.3s ease',
                    }}
                  />
                )}

                {/* Day node */}
                <button
                  ref={isCurrent ? currentDayRef : null}
                  onClick={() => onDayClick?.(day)}
                  disabled={isFuture}
                  className={`
                    relative flex items-center justify-center rounded-full
                    transition-all duration-300 ease-out
                    ${isMilestone ? 'w-12 h-12' : 'w-9 h-9'}
                    ${isCurrent ? 'scale-110' : 'hover:scale-105'}
                    ${isFuture ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  style={{
                    scrollSnapAlign: 'center',
                    backgroundColor: isCompleted
                      ? WEEK_PHASES[phase].color
                      : isCurrent
                        ? 'rgba(26, 46, 74, 0.1)'
                        : 'rgba(26, 46, 74, 0.04)',
                    border: isCurrent
                      ? `2px solid ${WEEK_PHASES[phase].color}`
                      : isCompleted
                        ? '2px solid transparent'
                        : '2px solid rgba(26, 46, 74, 0.1)',
                    boxShadow: isCurrent
                      ? `0 0 0 4px rgba(26, 46, 74, 0.1), 0 4px 12px rgba(26, 46, 74, 0.2)`
                      : isCompleted
                        ? '0 2px 8px rgba(26, 46, 74, 0.2)'
                        : 'none',
                  }}
                >
                  <span
                    className={`
                      font-medium
                      ${isMilestone ? 'text-sm' : 'text-xs'}
                    `}
                    style={{
                      color: isCompleted
                        ? '#fff'
                        : isCurrent
                          ? WEEK_PHASES[phase].color
                          : 'rgba(26, 46, 74, 0.4)',
                    }}
                  >
                    {day}
                  </span>

                  {/* Current day pulse animation */}
                  {isCurrent && (
                    <span
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{
                        backgroundColor: WEEK_PHASES[phase].color,
                        opacity: 0.2,
                        animationDuration: '2s',
                      }}
                    />
                  )}

                  {/* Milestone decoration */}
                  {isMilestone && isCompleted && (
                    <span
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: '#fff' }}
                    />
                  )}
                </button>

                {/* Milestone label */}
                {isMilestone && (
                  <span
                    className="mt-2 text-xs font-medium"
                    style={{
                      color: isCompleted ? WEEK_PHASES[phase].color : 'rgba(26, 46, 74, 0.3)',
                    }}
                  >
                    {day === 7 && 'Week 1'}
                    {day === 14 && 'Week 2'}
                    {day === 21 && 'Complete'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <div
          className="h-1 rounded-full"
          style={{
            width: '120px',
            backgroundColor: 'rgba(26, 46, 74, 0.1)',
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(currentDay / 21) * 100}%`,
              background: 'linear-gradient(90deg, #1a2e4a 0%, #2d5a8a 50%, #d4a039 100%)',
            }}
          />
        </div>
        <span className="text-xs" style={{ color: 'var(--blue)' }}>
          {Math.round((currentDay / 21) * 100)}%
        </span>
      </div>
    </div>
  );
}
