'use client';

import { useEffect, useState } from 'react';
import {
  ProgressRing,
  MilestoneTimeline,
  TodaysFocus,
  DailyCheckIn,
  HealingTasks,
  GoalTracker,
  MilestoneCelebration,
  StreakBadge,
} from '@/components/healing';
import { useHealingJourney } from '@/hooks/useHealingJourney';
import { DAILY_CONTENT, WEEK_PHASES } from '@/lib/healing-mock-data';
import { DailyEntry } from '@/lib/healing-types';

export default function DashboardPage() {
  const {
    progress,
    isLoading: journeyLoading,
    pendingMilestone,
    saveDailyEntry,
    toggleTaskCompletion,
    updateGoalProgress,
    addGoal,
    deleteGoal,
    acknowledgeMilestone,
    getTodayEntry,
    setCurrentDay,
  } = useHealingJourney();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoading = !mounted || journeyLoading || !progress;

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#fafafa' }}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-3 border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderColor: 'rgba(125, 69, 96, 0.2)', borderTopColor: '#7d4560', borderWidth: '3px' }}
          />
          <p className="text-sm" style={{ color: '#9a6b7d' }}>
            Loading your healing journey...
          </p>
        </div>
      </div>
    );
  }

  const firstName = 'Friend';
  const currentDay = progress.currentDay;
  const todayContent = DAILY_CONTENT[currentDay - 1] || DAILY_CONTENT[0];
  const weekPhase = WEEK_PHASES[todayContent.weekPhase];
  const todayEntry = getTodayEntry();

  const completedTaskIds = progress.taskCompletions.map((tc) => tc.taskId);

  const handleSaveEntry = (entry: DailyEntry) => {
    saveDailyEntry(entry);
  };

  const handleIntentionSave = (intention: string) => {
    const existingEntry = getTodayEntry();
    if (existingEntry) {
      saveDailyEntry({ ...existingEntry, intention });
    }
  };

  return (
    <div
      className="min-h-screen pb-16"
      style={{
        backgroundColor: '#fafafa',
        backgroundImage: `
          radial-gradient(ellipse at 20% 0%, rgba(125, 69, 96, 0.04) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 100%, rgba(125, 152, 175, 0.04) 0%, transparent 50%)
        `,
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(250, 250, 250, 0.9)',
          borderBottom: '1px solid rgba(125, 69, 96, 0.08)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm mb-1" style={{ color: '#9a6b7d' }}>
                Welcome back, {firstName}
              </p>
              <h1
                className="text-xl sm:text-2xl font-serif"
                style={{ color: '#7d4560' }}
              >
                Heal Your Attachment
              </h1>
              <p className="text-sm mt-0.5" style={{ color: '#6b5a62' }}>
                Build healthy relationships
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Week phase badge */}
              <div
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: `${weekPhase.color}10`,
                  border: `1px solid ${weekPhase.color}20`,
                }}
              >
                <span
                  className="text-xs font-medium tracking-wider uppercase"
                  style={{ color: weekPhase.color }}
                >
                  Week {Math.ceil(currentDay / 7)}: {weekPhase.label}
                </span>
              </div>

              <StreakBadge
                streak={progress.streak}
                longestStreak={progress.longestStreak}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Demo controls (for testing - can be removed in production) */}
        <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(125, 152, 175, 0.08)' }}>
          <p className="text-xs mb-2" style={{ color: '#7d98af' }}>
            Demo: Jump to day to test milestones
          </p>
          <div className="flex flex-wrap gap-2">
            {[1, 7, 8, 14, 15, 21].map((day) => (
              <button
                key={day}
                onClick={() => setCurrentDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentDay === day ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor:
                    currentDay === day ? '#7d4560' : 'rgba(125, 69, 96, 0.1)',
                  color: currentDay === day ? '#fff' : '#7d4560',
                }}
              >
                Day {day}
              </button>
            ))}
          </div>
        </div>

        {/* Hero section: Progress Ring + Today's Focus */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Ring */}
          <div
            className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl lg:col-span-1"
            style={{
              background: 'linear-gradient(180deg, #fff 0%, rgba(250, 250, 250, 0.9) 100%)',
              boxShadow: '0 4px 24px rgba(125, 69, 96, 0.06)',
              border: '1px solid rgba(125, 69, 96, 0.08)',
            }}
          >
            <ProgressRing currentDay={currentDay} />
            <p
              className="mt-4 text-sm text-center max-w-[200px]"
              style={{ color: '#6b5a62' }}
            >
              {currentDay <= 7
                ? 'Discovering your attachment patterns'
                : currentDay <= 14
                  ? 'Deep healing is unfolding'
                  : 'Integrating secure attachment'}
            </p>

            {/* Mobile week phase badge */}
            <div
              className="sm:hidden mt-4 px-4 py-2 rounded-full"
              style={{
                backgroundColor: `${weekPhase.color}10`,
                border: `1px solid ${weekPhase.color}20`,
              }}
            >
              <span
                className="text-xs font-medium tracking-wider uppercase"
                style={{ color: weekPhase.color }}
              >
                Week {Math.ceil(currentDay / 7)}: {weekPhase.label}
              </span>
            </div>
          </div>

          {/* Today's Focus */}
          <div className="lg:col-span-2">
            <TodaysFocus
              content={todayContent}
              intention={todayEntry?.intention}
              onIntentionSave={handleIntentionSave}
            />
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-8">
          <div
            className="rounded-3xl p-4 sm:p-6"
            style={{
              background: 'linear-gradient(180deg, #fff 0%, rgba(250, 250, 250, 0.9) 100%)',
              boxShadow: '0 4px 24px rgba(125, 69, 96, 0.06)',
              border: '1px solid rgba(125, 69, 96, 0.08)',
            }}
          >
            <h2
              className="text-lg font-serif mb-4 sm:mb-6 text-center"
              style={{ color: '#7d4560' }}
            >
              Your 21-Day Journey
            </h2>
            <MilestoneTimeline
              currentDay={currentDay}
              completedDays={progress.completedDays}
            />
          </div>
        </section>

        {/* Check-in and Tasks */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DailyCheckIn
            day={currentDay}
            existingEntry={todayEntry}
            onSave={handleSaveEntry}
          />
          <HealingTasks
            tasks={todayContent.tasks}
            completedTaskIds={completedTaskIds}
            onTaskToggle={toggleTaskCompletion}
          />
        </section>

        {/* Goals */}
        <section className="mb-8">
          <GoalTracker
            goals={progress.goals}
            onUpdateProgress={updateGoalProgress}
            onAddGoal={addGoal}
            onDeleteGoal={deleteGoal}
          />
        </section>

        {/* Recent reflections */}
        {progress.entries.length > 0 && (
          <section>
            <div
              className="rounded-3xl p-4 sm:p-6"
              style={{
                background: 'linear-gradient(180deg, #fff 0%, rgba(250, 250, 250, 0.9) 100%)',
                boxShadow: '0 4px 24px rgba(125, 69, 96, 0.06)',
                border: '1px solid rgba(125, 69, 96, 0.08)',
              }}
            >
              <h2
                className="text-lg font-serif mb-4"
                style={{ color: '#7d4560' }}
              >
                Recent Reflections
              </h2>
              <div className="space-y-4">
                {progress.entries
                  .slice(-3)
                  .reverse()
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 rounded-xl"
                      style={{
                        backgroundColor: 'rgba(125, 69, 96, 0.04)',
                        borderLeft: '3px solid rgba(125, 69, 96, 0.2)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-xs font-medium"
                          style={{ color: '#7d4560' }}
                        >
                          Day {entry.day}
                        </span>
                        <span className="text-xs" style={{ color: '#a8aabe' }}>
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {entry.reflection && (
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: '#5a4a52' }}
                        >
                          {entry.reflection}
                        </p>
                      )}
                      {entry.gratitude && (
                        <p
                          className="text-sm mt-2 italic"
                          style={{ color: '#7d98af' }}
                        >
                          Grateful for: {entry.gratitude}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Milestone Celebration Modal */}
      {pendingMilestone && (
        <MilestoneCelebration
          milestone={pendingMilestone}
          isOpen={!!pendingMilestone}
          onClose={() => acknowledgeMilestone(pendingMilestone)}
          completedDaysCount={progress.completedDays.length}
          completedTasksCount={progress.taskCompletions.length}
        />
      )}

      {/* Global styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        /* Hide scrollbar for timeline */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
