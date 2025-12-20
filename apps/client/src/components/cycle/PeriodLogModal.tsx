'use client';

import { useState } from 'react';

interface PeriodLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogStart: (date: string) => Promise<void>;
  onLogEnd: (date: string) => Promise<void>;
  hasOpenPeriod: boolean;
}

export function PeriodLogModal({
  isOpen,
  onClose,
  onLogStart,
  onLogEnd,
  hasOpenPeriod,
}: PeriodLogModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (hasOpenPeriod) {
        await onLogEnd(date);
      } else {
        await onLogStart(date);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log period');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6"
        style={{ background: 'var(--bg-card)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-xl font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          {hasOpenPeriod ? 'Log Period End' : 'Log Period Start'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              {hasOpenPeriod ? 'When did your period end?' : 'When did your period start?'}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-xl border transition-colors"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border-soft)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {error && (
            <p className="text-sm mb-4" style={{ color: '#E57373' }}>
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-medium transition-colors"
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl font-medium transition-colors"
              style={{
                background: isLoading ? 'var(--matcha-300)' : 'var(--matcha-500)',
                color: 'white',
              }}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>

        {!hasOpenPeriod && (
          <p
            className="text-xs text-center mt-4"
            style={{ color: 'var(--text-muted)' }}
          >
            Logging your period helps us provide personalized insights about your emotional patterns.
          </p>
        )}
      </div>
    </div>
  );
}
