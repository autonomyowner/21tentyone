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
import { GoldRect, GrainOverlay, artisticStyles } from '@/components/ui/ArtisticElements';

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
      <>
        <style jsx global>{artisticStyles}</style>
        <div
          className="artistic-page min-h-screen flex items-center justify-center"
          style={{ background: 'var(--cream)' }}
        >
          <div className="text-center">
            <div
              className="w-12 h-12 border-t-transparent animate-spin mx-auto mb-4"
              style={{ border: '2px solid var(--gold)', borderTopColor: 'transparent' }}
            />
            <p className="text-sm" style={{ color: 'var(--navy)', opacity: 0.6 }}>
              Loading your healing journey...
            </p>
          </div>
        </div>
      </>
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
    <>
      <style jsx global>{artisticStyles}</style>
      <div
        className="artistic-page min-h-screen pb-16 pt-20"
        style={{
          background: 'var(--cream)',
          backgroundImage: `
            radial-gradient(ellipse at 20% 0%, rgba(45, 90, 138, 0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, rgba(107, 156, 196, 0.04) 0%, transparent 50%)
          `,
        }}
      >
        <GrainOverlay />
        <GoldRect className="top-[30%] right-[3%] opacity-20" size="sm" delay={0} />
        <GoldRect className="bottom-[40%] left-[2%] opacity-15" size="md" delay={0.5} />

        {/* Header */}
        <header
          className="sticky top-20 z-40 backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(245, 240, 232, 0.95)',
            borderBottom: '1px solid rgba(26, 46, 74, 0.08)',
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm mb-1" style={{ color: 'var(--gold)' }}>
                  Welcome back, {firstName}
                </p>
                <h1
                  className="heading-serif text-xl sm:text-2xl font-light"
                  style={{ color: 'var(--navy)' }}
                >
                  Heal Your <span className="italic" style={{ color: 'var(--blue)' }}>Attachment</span>
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--navy)', opacity: 0.5 }}>
                  Build healthy relationships
                </p>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                {/* Week phase badge */}
                <div
                  className="hidden sm:flex items-center gap-2 px-4 py-2"
                  style={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid rgba(26, 46, 74, 0.1)',
                  }}
                >
                  <span
                    className="text-xs font-medium tracking-wider uppercase"
                    style={{ color: 'var(--gold)' }}
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
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          {/* Demo controls (for testing - can be removed in production) */}
          <div className="mb-6 p-4" style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(26, 46, 74, 0.08)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--navy)', opacity: 0.5 }}>
              Demo: Jump to day to test milestones
            </p>
            <div className="flex flex-wrap gap-2">
              {[1, 7, 8, 14, 15, 21].map((day) => (
                <button
                  key={day}
                  onClick={() => setCurrentDay(day)}
                  className="px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    backgroundColor: currentDay === day ? 'var(--navy)' : 'transparent',
                    color: currentDay === day ? 'var(--cream)' : 'var(--navy)',
                    border: `1px solid ${currentDay === day ? 'var(--navy)' : 'rgba(26, 46, 74, 0.2)'}`,
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
              className="flex flex-col items-center justify-center p-6 sm:p-8 lg:col-span-1"
              style={{
                background: 'var(--white)',
                border: '1px solid rgba(26, 46, 74, 0.08)',
              }}
            >
              <ProgressRing currentDay={currentDay} />
              <p
                className="mt-4 text-sm text-center max-w-[200px]"
                style={{ color: 'var(--navy)', opacity: 0.6 }}
              >
                {currentDay <= 7
                  ? 'Discovering your attachment patterns'
                  : currentDay <= 14
                    ? 'Deep healing is unfolding'
                    : 'Integrating secure attachment'}
              </p>

              {/* Mobile week phase badge */}
              <div
                className="sm:hidden mt-4 px-4 py-2"
                style={{
                  backgroundColor: 'rgba(212, 160, 57, 0.1)',
                  border: '1px solid var(--gold)',
                }}
              >
                <span
                  className="text-xs font-medium tracking-wider uppercase"
                  style={{ color: 'var(--gold)' }}
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
              className="p-4 sm:p-6"
              style={{
                background: 'var(--white)',
                border: '1px solid rgba(26, 46, 74, 0.08)',
              }}
            >
              <h2
                className="heading-serif text-lg font-light mb-4 sm:mb-6 text-center"
                style={{ color: 'var(--navy)' }}
              >
                Your 21-Day <span className="italic" style={{ color: 'var(--blue)' }}>Journey</span>
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
                className="p-4 sm:p-6"
                style={{
                  background: 'var(--white)',
                  border: '1px solid rgba(26, 46, 74, 0.08)',
                }}
              >
                <h2
                  className="heading-serif text-lg font-light mb-4"
                  style={{ color: 'var(--navy)' }}
                >
                  Recent <span className="italic" style={{ color: 'var(--blue)' }}>Reflections</span>
                </h2>
                <div className="space-y-4">
                  {progress.entries
                    .slice(-3)
                    .reverse()
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className="p-4"
                        style={{
                          backgroundColor: 'rgba(26, 46, 74, 0.02)',
                          borderLeft: '2px solid var(--gold)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-xs font-medium"
                            style={{ color: 'var(--gold)' }}
                          >
                            Day {entry.day}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--navy)', opacity: 0.4 }}>
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        {entry.reflection && (
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: 'var(--navy)', opacity: 0.7 }}
                          >
                            {entry.reflection}
                          </p>
                        )}
                        {entry.gratitude && (
                          <p
                            className="text-sm mt-2 italic"
                            style={{ color: 'var(--blue)' }}
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

      </div>
    </>
  );
}
