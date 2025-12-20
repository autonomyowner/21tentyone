'use client';

import { useState } from 'react';
import { CyclePhase, CYCLE_PHASE_INFO } from '@/lib/api';

interface CyclePhaseWidgetProps {
  phase: CyclePhase | null;
  cycleDay: number | null;
  daysUntilNextPhase: number | null;
  predictedNextPeriod?: string;
  recommendations?: {
    phase: string;
    title: string;
    description: string;
    tips: string[];
  };
  onLogPeriod: () => void;
  onEnableTracking?: () => void;
  isTracking: boolean;
}

export function CyclePhaseWidget({
  phase,
  cycleDay,
  daysUntilNextPhase,
  predictedNextPeriod,
  recommendations,
  onLogPeriod,
  onEnableTracking,
  isTracking,
}: CyclePhaseWidgetProps) {
  const [showTips, setShowTips] = useState(false);

  const phaseInfo = phase ? CYCLE_PHASE_INFO[phase] : null;

  // Format predicted next period date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!isTracking) {
    return (
      <div
        className="rounded-3xl p-6"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-soft)',
        }}
      >
        <h3
          className="font-semibold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Cycle Tracking
        </h3>
        <p
          className="text-sm mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          Track your menstrual cycle to get personalized insights about how your
          emotions and patterns change throughout the month.
        </p>
        <button
          onClick={onEnableTracking}
          className="w-full py-2 px-4 rounded-xl text-sm font-medium transition-colors"
          style={{
            background: 'var(--matcha-500)',
            color: 'white',
          }}
        >
          Enable Cycle Tracking
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl p-6"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-soft)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          Cycle Phase
        </h3>
        <button
          onClick={onLogPeriod}
          className="text-sm px-3 py-1.5 rounded-xl font-medium transition-colors"
          style={{
            background: 'var(--matcha-100)',
            color: 'var(--matcha-700)',
          }}
        >
          Log Period
        </button>
      </div>

      {phaseInfo ? (
        <>
          <div className="flex items-center gap-4 mb-4">
            {/* Phase indicator circle */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: `${phaseInfo.color}20` }}
            >
              <div
                className="w-8 h-8 rounded-full"
                style={{ background: phaseInfo.color }}
              />
            </div>

            <div className="flex-1">
              <div
                className="font-semibold text-lg"
                style={{ color: 'var(--text-primary)' }}
              >
                {phaseInfo.label}
              </div>
              <div
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                Day {cycleDay} - {phaseInfo.description}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div
            className="flex gap-4 py-3 px-4 rounded-xl mb-4"
            style={{ background: 'var(--bg-secondary)' }}
          >
            <div className="flex-1">
              <div
                className="text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-muted)' }}
              >
                Next Phase
              </div>
              <div
                className="font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {daysUntilNextPhase} days
              </div>
            </div>
            {predictedNextPeriod && (
              <div className="flex-1">
                <div
                  className="text-xs uppercase tracking-wide"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Next Period
                </div>
                <div
                  className="font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {formatDate(predictedNextPeriod)}
                </div>
              </div>
            )}
          </div>

          {/* Tips section */}
          {recommendations && (
            <div>
              <button
                onClick={() => setShowTips(!showTips)}
                className="flex items-center gap-2 text-sm font-medium w-full"
                style={{ color: 'var(--matcha-600)' }}
              >
                <span>{showTips ? 'Hide' : 'Show'} phase tips</span>
                <span
                  className="transition-transform"
                  style={{ transform: showTips ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  ▼
                </span>
              </button>

              {showTips && (
                <div
                  className="mt-3 space-y-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {recommendations.tips.map((tip, index) => (
                    <p key={index} className="text-sm flex gap-2">
                      <span style={{ color: phaseInfo.color }}>•</span>
                      <span>{tip}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-4">
          <p
            className="text-sm mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            Log your first period to start tracking your cycle
          </p>
          <button
            onClick={onLogPeriod}
            className="py-2 px-4 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: 'var(--matcha-500)',
              color: 'white',
            }}
          >
            Log Period Start
          </button>
        </div>
      )}
    </div>
  );
}
