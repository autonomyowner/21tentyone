'use client';

import { useState } from 'react';

interface DistressScaleProps {
  initialValue?: number;
  onSubmit: (value: number) => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
  submitLabel?: string;
}

export function DistressScale({
  initialValue = 5,
  onSubmit,
  onCancel,
  title = 'How distressed do you feel?',
  description = 'Rate your current level of distress when thinking about this issue.',
  submitLabel = 'Continue',
}: DistressScaleProps) {
  const [value, setValue] = useState(initialValue);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newValue = Math.round(percentage * 10);
    setValue(Math.max(0, Math.min(10, newValue)));
  };

  const getValueLabel = (val: number): string => {
    if (val <= 2) return 'Minimal distress';
    if (val <= 4) return 'Mild distress';
    if (val <= 6) return 'Moderate distress';
    if (val <= 8) return 'High distress';
    return 'Severe distress';
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] shadow-xl max-w-md w-full p-6 animate-fade-in">
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          {title}
        </h3>
        <p className="text-[var(--text-secondary)] text-sm mb-6">{description}</p>

        <div className="distress-scale-container">
          <div className="distress-scale-track" onClick={handleTrackClick}>
            <div
              className="distress-scale-thumb"
              style={{ left: `${value * 10}%` }}
            />
          </div>

          <div className="distress-scale-labels">
            <span>0 - None</span>
            <span>5 - Moderate</span>
            <span>10 - Extreme</span>
          </div>

          <div className="distress-scale-value">
            {value}
            <span className="block text-sm font-normal text-[var(--text-muted)]">
              {getValueLabel(value)}
            </span>
          </div>
        </div>

        {/* Number buttons for precise selection */}
        <div className="flex justify-between mt-4 mb-6">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              onClick={() => setValue(i)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                value === i
                  ? 'bg-[var(--matcha-500)] text-white'
                  : 'bg-[var(--cream-100)] text-[var(--text-secondary)] hover:bg-[var(--cream-200)]'
              }`}
            >
              {i}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-[var(--radius-md)] font-medium text-[var(--text-secondary)] bg-[var(--cream-100)] hover:bg-[var(--cream-200)] transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => onSubmit(value)}
            className="flex-1 py-3 px-4 rounded-[var(--radius-md)] font-medium text-white bg-gradient-to-r from-[var(--matcha-500)] to-[var(--matcha-600)] hover:from-[var(--matcha-600)] hover:to-[var(--matcha-700)] transition-all shadow-md hover:shadow-lg"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
