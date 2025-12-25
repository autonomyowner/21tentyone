'use client';

interface StreakBadgeProps {
  streak: number;
  longestStreak: number;
}

export function StreakBadge({ streak, longestStreak }: StreakBadgeProps) {
  const isActive = streak > 0;
  const isOnFire = streak >= 7;

  return (
    <div
      className={`relative inline-flex items-center gap-3 px-5 py-3 transition-all duration-300 ${
        isOnFire ? 'streak-glow' : ''
      }`}
      style={{
        backgroundColor: isActive
          ? 'rgba(212, 160, 57, 0.08)'
          : 'rgba(26, 46, 74, 0.06)',
        border: `1px solid ${
          isActive ? 'rgba(212, 160, 57, 0.2)' : 'rgba(26, 46, 74, 0.1)'
        }`,
      }}
    >
      {/* Flame decoration for streaks 7+ */}
      {isOnFire && (
        <div
          className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-xs"
          style={{
            background: 'var(--gold)',
            color: 'var(--navy)',
          }}
        >
          !
        </div>
      )}

      {/* Streak count */}
      <div className="flex flex-col items-center">
        <span
          className="heading-serif text-2xl leading-none"
          style={{ color: isActive ? 'var(--gold)' : 'rgba(26, 46, 74, 0.4)' }}
        >
          {streak}
        </span>
        <span
          className="text-xs mt-0.5"
          style={{ color: isActive ? 'var(--navy)' : 'rgba(26, 46, 74, 0.3)' }}
        >
          streak
        </span>
      </div>

      {/* Divider */}
      <div
        className="w-px h-8"
        style={{ backgroundColor: 'rgba(26, 46, 74, 0.1)' }}
      />

      {/* Longest streak */}
      <div className="flex flex-col items-center">
        <span
          className="text-lg font-medium leading-none"
          style={{ color: 'var(--blue)' }}
        >
          {longestStreak}
        </span>
        <span className="text-xs mt-0.5" style={{ color: 'var(--navy)', opacity: 0.4 }}>
          best
        </span>
      </div>

      {/* Glow animation for active streaks */}
      <style jsx global>{`
        @keyframes streakGlow {
          0%,
          100% {
            box-shadow: 0 0 12px rgba(212, 160, 57, 0.2);
          }
          50% {
            box-shadow: 0 0 24px rgba(212, 160, 57, 0.35);
          }
        }

        .streak-glow {
          animation: streakGlow 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
