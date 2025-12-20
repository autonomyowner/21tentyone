'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  JourneyProgress,
  DailyEntry,
  TaskCompletion,
  HealingGoal
} from '../lib/healing-types';
import { DEFAULT_GOALS } from '../lib/healing-mock-data';

const STORAGE_KEY = 'healing-journey-progress';

function initializeJourney(): JourneyProgress {
  const now = new Date().toISOString();
  return {
    startDate: now,
    currentDay: 1,
    completedDays: [],
    streak: 0,
    longestStreak: 0,
    milestonesReached: [],
    attachmentStyle: 'anxious',
    entries: [],
    taskCompletions: [],
    goals: DEFAULT_GOALS.map((g, i) => ({
      ...g,
      id: `goal-${i}`,
      createdAt: now,
      updatedAt: now,
    })),
  };
}

function calculateStreak(completedDays: number[]): number {
  if (completedDays.length === 0) return 0;

  const sorted = [...completedDays].sort((a, b) => b - a);
  let streak = 1;

  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i] - sorted[i + 1] === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateCurrentDay(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(diffDays + 1, 21);
}

export function useHealingJourney() {
  const [progress, setProgress] = useState<JourneyProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingMilestone, setPendingMilestone] = useState<7 | 14 | 21 | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: JourneyProgress = JSON.parse(stored);
        // Update current day based on start date
        parsed.currentDay = calculateCurrentDay(parsed.startDate);
        setProgress(parsed);
      } else {
        const initial = initializeJourney();
        setProgress(initial);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      }
    } catch (err) {
      console.error('Failed to load healing journey progress:', err);
      setError('Failed to load your progress');
      const initial = initializeJourney();
      setProgress(initial);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage on changes
  const saveProgress = useCallback((newProgress: JourneyProgress) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  }, []);

  // Save daily entry
  const saveDailyEntry = useCallback((entry: DailyEntry) => {
    if (!progress) return;

    const existingIndex = progress.entries.findIndex(e => e.date === entry.date);
    const newEntries = existingIndex >= 0
      ? progress.entries.map((e, i) => i === existingIndex ? entry : e)
      : [...progress.entries, entry];

    const newCompletedDays = [...new Set([...progress.completedDays, entry.day])].sort((a, b) => a - b);
    const newStreak = calculateStreak(newCompletedDays);

    // Check for new milestones
    const milestones: (7 | 14 | 21)[] = [7, 14, 21];
    for (const milestone of milestones) {
      if (newCompletedDays.includes(milestone) && !progress.milestonesReached.includes(milestone)) {
        setPendingMilestone(milestone);
        break;
      }
    }

    saveProgress({
      ...progress,
      entries: newEntries,
      completedDays: newCompletedDays,
      streak: newStreak,
      longestStreak: Math.max(progress.longestStreak, newStreak),
    });
  }, [progress, saveProgress]);

  // Toggle task completion
  const toggleTaskCompletion = useCallback((taskId: string) => {
    if (!progress) return;

    const existing = progress.taskCompletions.find(tc => tc.taskId === taskId);
    const newCompletions = existing
      ? progress.taskCompletions.filter(tc => tc.taskId !== taskId)
      : [...progress.taskCompletions, { taskId, completedAt: new Date().toISOString() }];

    saveProgress({
      ...progress,
      taskCompletions: newCompletions,
    });
  }, [progress, saveProgress]);

  // Update goal progress
  const updateGoalProgress = useCallback((goalId: string, newValue: number) => {
    if (!progress) return;

    const newGoals = progress.goals.map(g =>
      g.id === goalId
        ? { ...g, currentValue: Math.min(newValue, g.targetValue), updatedAt: new Date().toISOString() }
        : g
    );

    saveProgress({
      ...progress,
      goals: newGoals,
    });
  }, [progress, saveProgress]);

  // Add new goal
  const addGoal = useCallback((goal: Omit<HealingGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!progress) return;

    const now = new Date().toISOString();
    const newGoal: HealingGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    saveProgress({
      ...progress,
      goals: [...progress.goals, newGoal],
    });
  }, [progress, saveProgress]);

  // Delete goal
  const deleteGoal = useCallback((goalId: string) => {
    if (!progress) return;

    saveProgress({
      ...progress,
      goals: progress.goals.filter(g => g.id !== goalId),
    });
  }, [progress, saveProgress]);

  // Acknowledge milestone
  const acknowledgeMilestone = useCallback((milestone: 7 | 14 | 21) => {
    if (!progress) return;

    saveProgress({
      ...progress,
      milestonesReached: [...progress.milestonesReached, milestone],
    });
    setPendingMilestone(null);
  }, [progress, saveProgress]);

  // Get today's entry
  const getTodayEntry = useCallback(() => {
    if (!progress) return null;
    const today = new Date().toISOString().split('T')[0];
    return progress.entries.find(e => e.date === today) || null;
  }, [progress]);

  // Get entry for specific day
  const getEntryForDay = useCallback((day: number) => {
    if (!progress) return null;
    return progress.entries.find(e => e.day === day) || null;
  }, [progress]);

  // Check if task is completed
  const isTaskCompleted = useCallback((taskId: string) => {
    if (!progress) return false;
    return progress.taskCompletions.some(tc => tc.taskId === taskId);
  }, [progress]);

  // Get completed task count for a day
  const getCompletedTaskCount = useCallback((day: number, totalTasks: number) => {
    if (!progress) return 0;
    const dayTasks = progress.taskCompletions.filter(tc => tc.taskId.startsWith(`task-${day}-`));
    return dayTasks.length;
  }, [progress]);

  // Reset journey
  const resetJourney = useCallback(() => {
    const initial = initializeJourney();
    saveProgress(initial);
    setPendingMilestone(null);
  }, [saveProgress]);

  // Set current day manually (for demo purposes)
  const setCurrentDay = useCallback((day: number) => {
    if (!progress) return;
    saveProgress({
      ...progress,
      currentDay: Math.max(1, Math.min(21, day)),
    });
  }, [progress, saveProgress]);

  return {
    progress,
    isLoading,
    error,
    pendingMilestone,
    saveDailyEntry,
    toggleTaskCompletion,
    updateGoalProgress,
    addGoal,
    deleteGoal,
    acknowledgeMilestone,
    getTodayEntry,
    getEntryForDay,
    isTaskCompleted,
    getCompletedTaskCount,
    resetJourney,
    setCurrentDay,
  };
}
