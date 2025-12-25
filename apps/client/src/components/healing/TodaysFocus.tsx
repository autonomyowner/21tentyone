'use client';

import { useState } from 'react';
import { DailyContent, WeekPhase } from '@/lib/healing-types';
import { WEEK_PHASES } from '@/lib/healing-mock-data';

interface TodaysFocusProps {
  content: DailyContent;
  intention?: string;
  onIntentionSave: (intention: string) => void;
}

export function TodaysFocus({
  content,
  intention = '',
  onIntentionSave,
}: TodaysFocusProps) {
  const [localIntention, setLocalIntention] = useState(intention);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const phase = WEEK_PHASES[content.weekPhase];

  const handleSave = () => {
    onIntentionSave(localIntention);
    setIsEditing(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div
      className="relative overflow-hidden p-6"
      style={{
        background: 'var(--white)',
        border: '1px solid rgba(26, 46, 74, 0.08)',
        borderLeft: `4px solid ${phase.color}`,
      }}
    >
      {/* Decorative background element */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5"
        style={{
          background: `radial-gradient(circle, ${phase.color} 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)',
        }}
      />

      {/* Week phase badge */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="px-3 py-1 text-xs font-medium tracking-wider uppercase"
          style={{
            backgroundColor: `${phase.color}15`,
            color: phase.color,
          }}
        >
          {phase.label}
        </span>
        <span className="text-xs" style={{ color: 'var(--navy)', opacity: 0.4 }}>
          Day {content.day}
        </span>
      </div>

      {/* Theme */}
      <h3
        className="text-sm font-medium mb-3 tracking-wide"
        style={{ color: 'var(--navy)' }}
      >
        {content.theme}
      </h3>

      {/* Affirmation */}
      <blockquote
        className="heading-serif text-xl md:text-2xl font-light leading-relaxed mb-6"
        style={{ color: 'var(--navy)' }}
      >
        "{content.affirmation}"
      </blockquote>

      {/* Today's focus description */}
      <p
        className="text-sm mb-6 leading-relaxed"
        style={{ color: 'var(--navy)', opacity: 0.6 }}
      >
        {content.attachmentFocus}
      </p>

      {/* Divider */}
      <div
        className="h-px mb-6"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(26, 46, 74, 0.15) 50%, transparent 100%)',
        }}
      />

      {/* Intention input */}
      <div>
        <label
          className="block text-xs font-medium tracking-wider uppercase mb-3"
          style={{ color: 'var(--gold)' }}
        >
          Your Intention for Today
        </label>

        {isEditing || !localIntention ? (
          <div className="relative">
            <textarea
              value={localIntention}
              onChange={(e) => setLocalIntention(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              onFocus={() => setIsEditing(true)}
              placeholder="What do you want to focus on today?"
              rows={2}
              className="w-full px-4 py-3 text-sm resize-none transition-all duration-200"
              style={{
                backgroundColor: 'rgba(26, 46, 74, 0.02)',
                border: '1px solid rgba(26, 46, 74, 0.12)',
                color: 'var(--navy)',
                outline: 'none',
              }}
              autoFocus={isEditing}
            />
            <button
              onClick={handleSave}
              className="absolute bottom-3 right-3 px-3 py-1 text-xs font-medium transition-all duration-200 hover:opacity-80"
              style={{
                backgroundColor: 'var(--gold)',
                color: 'var(--navy)',
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full text-left px-4 py-3 transition-all duration-200 hover:bg-white/50 group"
            style={{
              backgroundColor: 'rgba(26, 46, 74, 0.02)',
              border: '1px solid rgba(26, 46, 74, 0.08)',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--navy)' }}>
              {localIntention}
            </p>
            <span
              className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--blue)' }}
            >
              Click to edit
            </span>
          </button>
        )}

        {/* Save confirmation */}
        {isSaved && (
          <p
            className="text-xs mt-2 transition-opacity duration-300"
            style={{ color: 'var(--gold)' }}
          >
            Intention saved
          </p>
        )}
      </div>

      {/* Journal prompt */}
      <div className="mt-6 p-4" style={{ backgroundColor: 'rgba(45, 90, 138, 0.06)' }}>
        <span
          className="text-xs font-medium tracking-wider uppercase"
          style={{ color: 'var(--blue)' }}
        >
          Journal Prompt
        </span>
        <p className="mt-2 text-sm italic" style={{ color: 'var(--navy)', opacity: 0.7 }}>
          {content.journalPrompt}
        </p>
      </div>
    </div>
  );
}
