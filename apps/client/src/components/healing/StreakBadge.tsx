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
      className={`relative inline-flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 ${
        isOnFire ? 'streak-glow' : ''
      }`}
      style={{
        backgroundColor: isActive
          ? 'rgba(125, 69, 96, 0.08)'
          : 'rgba(168, 170, 190, 0.1)',
        border: `1px solid ${
          isActive ? 'rgba(125, 69, 96, 0.15)' : 'rgba(168, 170, 190, 0.15)'
        }`,
      }}
    >
      {/* Flame decoration for streaks 7+ */}
      {isOnFire && (
        <div
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs"
          style={{
            background: 'linear-gradient(135deg, #7d4560 0%, #9a6b7d 100%)',
            color: '#fff',
          }}
        >
          !
        </div>
      )}

      {/* Streak count */}
      <div className="flex flex-col items-center">
        <span
          className="text-2xl font-serif leading-none"
          style={{ color: isActive ? '#7d4560' : '#a8aabe' }}
        >
          {streak}
        </span>
        <span
          className="text-xs mt-0.5"
          style={{ color: isActive ? '#9a6b7d' : '#c8cad5' }}
        >
          streak
        </span>
      </div>

      {/* Divider */}
      <div
        className="w-px h-8"
        style={{ backgroundColor: 'rgba(125, 69, 96, 0.1)' }}
      />

      {/* Longest streak */}
      <div className="flex flex-col items-center">
        <span
          className="text-lg font-medium leading-none"
          style={{ color: '#7d98af' }}
        >
          {longestStreak}
        </span>
        <span className="text-xs mt-0.5" style={{ color: '#a8aabe' }}>
          best
        </span>
      </div>

      {/* Glow animation for active streaks */}
      <style jsx global>{`
        @keyframes streakGlow {
          0%,
          100% {
            box-shadow: 0 0 12px rgba(125, 69, 96, 0.2);
          }
          50% {
            box-shadow: 0 0 24px rgba(125, 69, 96, 0.35);
          }
        }

        .streak-glow {
          animation: streakGlow 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
