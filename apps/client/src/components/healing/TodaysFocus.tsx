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
      className="relative overflow-hidden rounded-2xl p-6"
      style={{
        background: 'linear-gradient(135deg, rgba(125, 69, 96, 0.04) 0%, rgba(250, 250, 250, 0.8) 100%)',
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
          className="px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase"
          style={{
            backgroundColor: `${phase.color}15`,
            color: phase.color,
          }}
        >
          {phase.label}
        </span>
        <span className="text-xs" style={{ color: '#a8aabe' }}>
          Day {content.day}
        </span>
      </div>

      {/* Theme */}
      <h3
        className="text-sm font-medium mb-3 tracking-wide"
        style={{ color: '#7d4560' }}
      >
        {content.theme}
      </h3>

      {/* Affirmation */}
      <blockquote
        className="font-serif text-xl md:text-2xl leading-relaxed mb-6"
        style={{ color: '#4a3a42' }}
      >
        "{content.affirmation}"
      </blockquote>

      {/* Today's focus description */}
      <p
        className="text-sm mb-6 leading-relaxed"
        style={{ color: '#6b5a62' }}
      >
        {content.attachmentFocus}
      </p>

      {/* Divider */}
      <div
        className="h-px mb-6"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(125, 69, 96, 0.15) 50%, transparent 100%)',
        }}
      />

      {/* Intention input */}
      <div>
        <label
          className="block text-xs font-medium tracking-wider uppercase mb-3"
          style={{ color: '#9a6b7d' }}
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
              className="w-full px-4 py-3 rounded-xl text-sm resize-none transition-all duration-200"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(125, 69, 96, 0.15)',
                color: '#4a3a42',
                outline: 'none',
              }}
              autoFocus={isEditing}
            />
            <button
              onClick={handleSave}
              className="absolute bottom-3 right-3 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
              style={{
                backgroundColor: phase.color,
                color: '#fff',
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/50 group"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              border: '1px solid rgba(125, 69, 96, 0.1)',
            }}
          >
            <p className="text-sm" style={{ color: '#4a3a42' }}>
              {localIntention}
            </p>
            <span
              className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: '#9a6b7d' }}
            >
              Click to edit
            </span>
          </button>
        )}

        {/* Save confirmation */}
        {isSaved && (
          <p
            className="text-xs mt-2 transition-opacity duration-300"
            style={{ color: '#7d98af' }}
          >
            Intention saved
          </p>
        )}
      </div>

      {/* Journal prompt */}
      <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(125, 152, 175, 0.08)' }}>
        <span
          className="text-xs font-medium tracking-wider uppercase"
          style={{ color: '#7d98af' }}
        >
          Journal Prompt
        </span>
        <p className="mt-2 text-sm italic" style={{ color: '#5a6a75' }}>
          {content.journalPrompt}
        </p>
      </div>
    </div>
  );
}
