// 21-Day Attachment Healing Journey - Type Definitions

export type AttachmentStyle = 'secure' | 'anxious' | 'avoidant' | 'disorganized';
export type WeekPhase = 'awareness' | 'healing' | 'integration';
export type TaskCategory = 'reflection' | 'exercise' | 'journaling' | 'breathing';
export type GoalCategory = 'attachment' | 'relationship' | 'self-care' | 'mindfulness';

export interface DailyEntry {
  id: string;
  date: string;
  day: number;
  mood: number;
  energy: number;
  attachmentAwareness: number;
  reflection: string;
  gratitude: string;
  attachmentInsight: string;
  intention: string;
  completedAt?: string;
}

export interface HealingTask {
  id: string;
  day: number;
  title: string;
  description: string;
  detailedInstructions: string;
  duration: string;
  category: TaskCategory;
  order: number;
}

export interface TaskCompletion {
  taskId: string;
  completedAt: string;
  notes?: string;
}

export interface HealingGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: GoalCategory;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyProgress {
  startDate: string;
  currentDay: number;
  completedDays: number[];
  streak: number;
  longestStreak: number;
  milestonesReached: number[];
  attachmentStyle: AttachmentStyle;
  entries: DailyEntry[];
  taskCompletions: TaskCompletion[];
  goals: HealingGoal[];
}

export interface DailyContent {
  day: number;
  weekPhase: WeekPhase;
  theme: string;
  affirmation: string;
  tasks: HealingTask[];
  journalPrompt: string;
  attachmentFocus: string;
}

export interface MilestoneData {
  day: 7 | 14 | 21;
  title: string;
  subtitle: string;
  message: string;
  achievement: string;
}
