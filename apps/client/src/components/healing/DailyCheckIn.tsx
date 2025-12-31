'use client';

import { useState, useEffect } from 'react';
import { DailyEntry } from '@/lib/healing-types';

interface DailyCheckInProps {
  day: number;
  existingEntry?: DailyEntry | null;
  onSave: (entry: DailyEntry) => void;
}

const MOOD_LABELS = [
  { value: 1, label: 'Struggling' },
  { value: 3, label: 'Difficult' },
  { value: 5, label: 'Neutral' },
  { value: 7, label: 'Good' },
  { value: 10, label: 'Thriving' },
];

const ENERGY_LABELS = [
  { value: 1, label: 'Depleted' },
  { value: 3, label: 'Low' },
  { value: 5, label: 'Moderate' },
  { value: 7, label: 'Good' },
  { value: 10, label: 'Energized' },
];

const AWARENESS_LABELS = [
  { value: 1, label: 'Triggered' },
  { value: 3, label: 'Unsettled' },
  { value: 5, label: 'Aware' },
  { value: 7, label: 'Grounded' },
  { value: 10, label: 'Secure' },
];

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  labels: { value: number; label: string }[];
  color: string;
}

function Slider({ label, value, onChange, labels, color }: SliderProps) {
  const percentage = ((value - 1) / 9) * 100;

  const getCurrentLabel = () => {
    const closest = labels.reduce((prev, curr) =>
      Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
    );
    return closest.label;
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium" style={{ color: 'var(--navy)' }}>
          {label}
        </span>
        <span
          className="text-xs px-2 py-0.5 font-medium"
          style={{
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          {getCurrentLabel()}
        </span>
      </div>

      <div className="relative h-10 flex items-center">
        {/* Track background */}
        <div
          className="absolute w-full h-2 rounded-full"
          style={{ backgroundColor: 'rgba(129, 53, 46, 0.1)' }}
        />

        {/* Filled track */}
        <div
          className="absolute h-2 rounded-full transition-all duration-200"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}40 0%, ${color} 100%)`,
          }}
        />

        {/* Input */}
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
        />

        {/* Thumb */}
        <div
          className="absolute w-5 h-5 rounded-full shadow-md transition-all duration-200 pointer-events-none"
          style={{
            left: `calc(${percentage}% - 10px)`,
            backgroundColor: '#fff',
            border: `3px solid ${color}`,
            boxShadow: `0 2px 8px ${color}40`,
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1">
        <span className="text-xs" style={{ color: 'var(--navy)', opacity: 0.4 }}>
          {labels[0].label}
        </span>
        <span className="text-xs" style={{ color: 'var(--navy)', opacity: 0.4 }}>
          {labels[labels.length - 1].label}
        </span>
      </div>
    </div>
  );
}

export function DailyCheckIn({ day, existingEntry, onSave }: DailyCheckInProps) {
  const [formData, setFormData] = useState({
    mood: existingEntry?.mood || 5,
    energy: existingEntry?.energy || 5,
    attachmentAwareness: existingEntry?.attachmentAwareness || 5,
    reflection: existingEntry?.reflection || '',
    gratitude: existingEntry?.gratitude || '',
    attachmentInsight: existingEntry?.attachmentInsight || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existingEntry) {
      setFormData({
        mood: existingEntry.mood,
        energy: existingEntry.energy,
        attachmentAwareness: existingEntry.attachmentAwareness,
        reflection: existingEntry.reflection,
        gratitude: existingEntry.gratitude,
        attachmentInsight: existingEntry.attachmentInsight,
      });
    }
  }, [existingEntry]);

  const handleSave = () => {
    setIsSaving(true);

    const entry: DailyEntry = {
      id: existingEntry?.id || `entry-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      day,
      ...formData,
      intention: existingEntry?.intention || '',
      completedAt: new Date().toISOString(),
    };

    onSave(entry);

    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  const isComplete = formData.reflection.length > 0;

  return (
    <div
      className="p-6"
      style={{
        background: 'var(--white)',
        border: '1px solid rgba(129, 53, 46, 0.08)',
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="heading-serif text-lg font-light" style={{ color: 'var(--navy)' }}>
          Daily Check-in
        </h3>
        {existingEntry && (
          <span
            className="text-xs px-2 py-1"
            style={{
              backgroundColor: 'rgba(186, 84, 72, 0.15)',
              color: 'var(--gold)',
            }}
          >
            Completed
          </span>
        )}
      </div>

      {/* Sliders */}
      <Slider
        label="How are you feeling?"
        value={formData.mood}
        onChange={(mood) => setFormData((prev) => ({ ...prev, mood }))}
        labels={MOOD_LABELS}
        color="#81352E"
      />

      <Slider
        label="Energy level"
        value={formData.energy}
        onChange={(energy) => setFormData((prev) => ({ ...prev, energy }))}
        labels={ENERGY_LABELS}
        color="#9D433A"
      />

      <Slider
        label="Attachment awareness"
        value={formData.attachmentAwareness}
        onChange={(attachmentAwareness) =>
          setFormData((prev) => ({ ...prev, attachmentAwareness }))
        }
        labels={AWARENESS_LABELS}
        color="#BA5448"
      />

      {/* Divider */}
      <div
        className="h-px my-6"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(129, 53, 46, 0.1) 50%, transparent 100%)',
        }}
      />

      {/* Text areas */}
      <div className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--navy)' }}
          >
            Reflection
          </label>
          <textarea
            value={formData.reflection}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reflection: e.target.value }))
            }
            placeholder="What came up for you today?"
            rows={3}
            className="w-full px-4 py-3 text-sm resize-none transition-all duration-200 focus:ring-2"
            style={{
              backgroundColor: 'rgba(129, 53, 46, 0.02)',
              border: '1px solid rgba(129, 53, 46, 0.1)',
              color: 'var(--navy)',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--navy)' }}
          >
            Gratitude
          </label>
          <textarea
            value={formData.gratitude}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, gratitude: e.target.value }))
            }
            placeholder="What are you grateful for today?"
            rows={2}
            className="w-full px-4 py-3 text-sm resize-none transition-all duration-200"
            style={{
              backgroundColor: 'rgba(129, 53, 46, 0.02)',
              border: '1px solid rgba(129, 53, 46, 0.1)',
              color: 'var(--navy)',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--navy)' }}
          >
            Attachment Insight
          </label>
          <textarea
            value={formData.attachmentInsight}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, attachmentInsight: e.target.value }))
            }
            placeholder="What did you notice about your attachment patterns?"
            rows={2}
            className="w-full px-4 py-3 text-sm resize-none transition-all duration-200"
            style={{
              backgroundColor: 'rgba(129, 53, 46, 0.02)',
              border: '1px solid rgba(129, 53, 46, 0.1)',
              color: 'var(--navy)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="mt-6 w-full py-3 font-medium text-sm transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
        style={{
          background: isComplete
            ? 'var(--gold)'
            : 'rgba(129, 53, 46, 0.2)',
          color: isComplete ? 'var(--navy)' : 'var(--navy)',
          boxShadow: isComplete ? '0 4px 16px rgba(186, 84, 72, 0.3)' : 'none',
        }}
      >
        {isSaving ? (
          <span className="inline-flex items-center gap-2">
            <span
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            />
            Saving...
          </span>
        ) : saved ? (
          'Saved Successfully'
        ) : existingEntry ? (
          'Update Check-in'
        ) : (
          'Complete Check-in'
        )}
      </button>
    </div>
  );
}
