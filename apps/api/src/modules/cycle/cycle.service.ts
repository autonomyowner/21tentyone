import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CyclePhase } from '@prisma/client';

export interface CurrentPhaseData {
  phase: CyclePhase;
  cycleDay: number;
  daysUntilNextPhase: number;
  predictedNextPeriod: Date;
  confidence: number;
  isTracking: boolean;
}

export interface PhaseRecommendation {
  phase: CyclePhase;
  title: string;
  description: string;
  tips: string[];
}

export interface CalendarDay {
  date: string;
  phase: CyclePhase | null;
  cycleDay: number | null;
  isPeriod: boolean;
  isPrediction: boolean;
}

const PHASE_DAYS = {
  MENSTRUAL: { start: 1, end: 5 },
  FOLLICULAR: { start: 6, end: 13 },
  OVULATION: { start: 14, end: 16 },
  LUTEAL: { start: 17, end: 28 },
};

@Injectable()
export class CycleService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get or create cycle settings for a user
   */
  async getSettings(userId: string) {
    let settings = await this.prisma.cycleSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await this.prisma.cycleSettings.create({
        data: {
          userId,
          isTrackingEnabled: false,
        },
      });
    }

    return settings;
  }

  /**
   * Update cycle settings
   */
  async updateSettings(
    userId: string,
    data: {
      isTrackingEnabled?: boolean;
      averageCycleLength?: number;
      averagePeriodLength?: number;
      sendPhaseNotifications?: boolean;
    },
  ) {
    return this.prisma.cycleSettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }

  /**
   * Log period start
   */
  async startPeriod(userId: string, date?: Date) {
    const periodStart = date || new Date();

    // Check if there's an existing unclosed period
    const existingOpen = await this.prisma.cycleEntry.findFirst({
      where: {
        userId,
        periodEnd: null,
      },
      orderBy: { periodStart: 'desc' },
    });

    if (existingOpen) {
      // Close the existing period first (assume it ended day before new one)
      const dayBefore = new Date(periodStart);
      dayBefore.setDate(dayBefore.getDate() - 1);
      await this.prisma.cycleEntry.update({
        where: { id: existingOpen.id },
        data: { periodEnd: dayBefore },
      });
    }

    // Calculate cycle length from previous period
    const previousPeriod = await this.prisma.cycleEntry.findFirst({
      where: { userId },
      orderBy: { periodStart: 'desc' },
    });

    let cycleLength: number | null = null;
    if (previousPeriod) {
      const diffTime = periodStart.getTime() - previousPeriod.periodStart.getTime();
      cycleLength = Math.round(diffTime / (1000 * 60 * 60 * 24));

      // Update previous entry with calculated cycle length
      if (cycleLength > 0 && cycleLength < 60) {
        await this.prisma.cycleEntry.update({
          where: { id: previousPeriod.id },
          data: { cycleLength },
        });
      }
    }

    // Create new period entry
    const entry = await this.prisma.cycleEntry.create({
      data: {
        userId,
        periodStart,
      },
    });

    // Update settings with last period start
    await this.prisma.cycleSettings.upsert({
      where: { userId },
      update: { lastPeriodStart: periodStart, isTrackingEnabled: true },
      create: { userId, lastPeriodStart: periodStart, isTrackingEnabled: true },
    });

    // Update average cycle length if we have enough data
    await this.updateAverageCycleLength(userId);

    return entry;
  }

  /**
   * Log period end
   */
  async endPeriod(userId: string, date?: Date) {
    const periodEnd = date || new Date();

    const openPeriod = await this.prisma.cycleEntry.findFirst({
      where: {
        userId,
        periodEnd: null,
      },
      orderBy: { periodStart: 'desc' },
    });

    if (!openPeriod) {
      throw new NotFoundException('No open period found to close');
    }

    const entry = await this.prisma.cycleEntry.update({
      where: { id: openPeriod.id },
      data: { periodEnd },
    });

    // Update average period length
    await this.updateAveragePeriodLength(userId);

    return entry;
  }

  /**
   * Get period history
   */
  async getPeriodHistory(userId: string, limit = 12) {
    return this.prisma.cycleEntry.findMany({
      where: { userId },
      orderBy: { periodStart: 'desc' },
      take: limit,
    });
  }

  /**
   * Calculate current cycle phase
   */
  async getCurrentPhase(userId: string): Promise<CurrentPhaseData | null> {
    const settings = await this.prisma.cycleSettings.findUnique({
      where: { userId },
    });

    if (!settings?.lastPeriodStart || !settings.isTrackingEnabled) {
      return null;
    }

    const today = new Date();
    const lastPeriod = new Date(settings.lastPeriodStart);
    const cycleLength = settings.averageCycleLength;

    // Calculate cycle day (1-indexed)
    const diffTime = today.getTime() - lastPeriod.getTime();
    let cycleDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Handle cycles longer than expected (wrap around)
    if (cycleDay > cycleLength) {
      cycleDay = ((cycleDay - 1) % cycleLength) + 1;
    }

    // Determine phase based on cycle day
    const phase = this.getPhaseForDay(cycleDay, cycleLength);
    const daysUntilNextPhase = this.getDaysUntilNextPhase(cycleDay, cycleLength);

    // Predict next period
    const daysUntilNextPeriod = cycleLength - cycleDay + 1;
    const predictedNextPeriod = new Date(today);
    predictedNextPeriod.setDate(today.getDate() + daysUntilNextPeriod);

    // Calculate confidence based on data points
    const entryCount = await this.prisma.cycleEntry.count({
      where: { userId },
    });
    const confidence = Math.min(0.95, 0.5 + entryCount * 0.1);

    return {
      phase,
      cycleDay,
      daysUntilNextPhase,
      predictedNextPeriod,
      confidence,
      isTracking: true,
    };
  }

  /**
   * Log daily symptoms
   */
  async logDay(
    userId: string,
    data: {
      date: string;
      energy?: number;
      mood?: number;
      anxiety?: number;
      cramps?: number;
      bloating?: number;
      headache?: number;
      notes?: string;
    },
  ) {
    const currentPhase = await this.getCurrentPhase(userId);
    if (!currentPhase) {
      throw new NotFoundException('Cycle tracking not enabled');
    }

    const logDate = new Date(data.date);

    return this.prisma.cycleLog.upsert({
      where: {
        userId_date: {
          userId,
          date: logDate,
        },
      },
      update: {
        energy: data.energy,
        mood: data.mood,
        anxiety: data.anxiety,
        cramps: data.cramps,
        bloating: data.bloating,
        headache: data.headache,
        notes: data.notes,
      },
      create: {
        userId,
        date: logDate,
        phase: currentPhase.phase,
        cycleDay: currentPhase.cycleDay,
        energy: data.energy,
        mood: data.mood,
        anxiety: data.anxiety,
        cramps: data.cramps,
        bloating: data.bloating,
        headache: data.headache,
        notes: data.notes,
      },
    });
  }

  /**
   * Get log for a specific date
   */
  async getLog(userId: string, date: string) {
    return this.prisma.cycleLog.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(date),
        },
      },
    });
  }

  /**
   * Get logs for a date range
   */
  async getLogs(userId: string, startDate: string, endDate: string) {
    return this.prisma.cycleLog.findMany({
      where: {
        userId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Get calendar data for a month
   */
  async getCalendar(userId: string, year: number, month: number): Promise<{ days: CalendarDay[] }> {
    const settings = await this.prisma.cycleSettings.findUnique({
      where: { userId },
    });

    const days: CalendarDay[] = [];
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get period entries for this month
    const periodEntries = await this.prisma.cycleEntry.findMany({
      where: {
        userId,
        OR: [
          { periodStart: { gte: startDate, lte: endDate } },
          { periodEnd: { gte: startDate, lte: endDate } },
          {
            AND: [
              { periodStart: { lte: startDate } },
              { OR: [{ periodEnd: { gte: endDate } }, { periodEnd: null }] },
            ],
          },
        ],
      },
    });

    // Get logged days
    const loggedDays = await this.prisma.cycleLog.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
    });

    const logMap = new Map(loggedDays.map((l) => [l.date.toISOString().split('T')[0], l]));

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const log = logMap.get(dateStr);

      // Check if this day is during a logged period
      const isPeriod = periodEntries.some((entry) => {
        const start = new Date(entry.periodStart);
        const end = entry.periodEnd ? new Date(entry.periodEnd) : new Date();
        return d >= start && d <= end;
      });

      // Calculate phase and cycle day
      let phase: CyclePhase | null = null;
      let cycleDay: number | null = null;
      let isPrediction = false;

      if (settings?.lastPeriodStart) {
        const lastPeriod = new Date(settings.lastPeriodStart);
        const diffTime = d.getTime() - lastPeriod.getTime();
        const rawCycleDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (rawCycleDay > 0) {
          cycleDay = ((rawCycleDay - 1) % settings.averageCycleLength) + 1;
          phase = this.getPhaseForDay(cycleDay, settings.averageCycleLength);
          isPrediction = d > new Date(); // Future dates are predictions
        }
      }

      if (log) {
        phase = log.phase;
        cycleDay = log.cycleDay;
      }

      days.push({
        date: dateStr,
        phase,
        cycleDay,
        isPeriod,
        isPrediction,
      });
    }

    return { days };
  }

  /**
   * Get cycle insights for a user
   */
  async getInsights(userId: string) {
    return this.prisma.cycleInsight.findMany({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
      take: 10,
    });
  }

  /**
   * Get phase-specific recommendations
   */
  getPhaseRecommendations(phase: CyclePhase): PhaseRecommendation {
    const recommendations: Record<CyclePhase, PhaseRecommendation> = {
      MENSTRUAL: {
        phase: 'MENSTRUAL',
        title: 'Rest & Reflect',
        description: 'Your body is releasing and renewing. Low energy is completely normal during this phase.',
        tips: [
          'Prioritize rest and gentle movement',
          'Practice self-compassion if emotions feel intense',
          'This is a good time for journaling and reflection',
          'Your attachment patterns may feel more pronounced - this is temporary',
        ],
      },
      FOLLICULAR: {
        phase: 'FOLLICULAR',
        title: 'Rising Energy',
        description: 'Energy and optimism are building. Great time for new beginnings and difficult conversations.',
        tips: [
          'Take on challenging tasks - your focus is strong',
          'Ideal time for relationship work and honest communication',
          'Your secure attachment patterns are most accessible now',
          'Start new habits or projects during this window',
        ],
      },
      OVULATION: {
        phase: 'OVULATION',
        title: 'Peak Energy',
        description: 'Social confidence and energy are at their highest. Make the most of this window.',
        tips: [
          'Schedule important conversations and social events',
          'Your communication skills are enhanced',
          'Be aware of heightened desire for connection and validation',
          'Great time for networking and relationship building',
        ],
      },
      LUTEAL: {
        phase: 'LUTEAL',
        title: 'Wind Down',
        description: 'Energy decreases as your body prepares for the next cycle. Emotional sensitivity may increase.',
        tips: [
          'Your triggers may feel amplified - this is biological, not a character flaw',
          'The Flash Technique can be especially helpful during this phase',
          'Avoid making major decisions when emotions are intense',
          'Practice extra self-care and boundary-setting',
        ],
      },
    };

    return recommendations[phase];
  }

  /**
   * Get cycle context for AI prompts
   */
  async getCycleContext(userId: string) {
    const settings = await this.prisma.cycleSettings.findUnique({
      where: { userId },
    });

    if (!settings?.isTrackingEnabled) {
      return { isTracking: false };
    }

    const currentPhase = await this.getCurrentPhase(userId);
    if (!currentPhase) {
      return { isTracking: false };
    }

    // Get recent symptoms
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    const recentLogs = await this.prisma.cycleLog.findMany({
      where: {
        userId,
        date: { gte: threeDaysAgo, lte: today },
      },
      orderBy: { date: 'desc' },
      take: 3,
    });

    // Calculate average symptoms
    let avgEnergy: number | undefined;
    let avgMood: number | undefined;
    let avgAnxiety: number | undefined;

    if (recentLogs.length > 0) {
      const energyValues = recentLogs.filter((l) => l.energy).map((l) => l.energy!);
      const moodValues = recentLogs.filter((l) => l.mood).map((l) => l.mood!);
      const anxietyValues = recentLogs.filter((l) => l.anxiety).map((l) => l.anxiety!);

      if (energyValues.length) avgEnergy = Math.round(energyValues.reduce((a, b) => a + b, 0) / energyValues.length);
      if (moodValues.length) avgMood = Math.round(moodValues.reduce((a, b) => a + b, 0) / moodValues.length);
      if (anxietyValues.length) avgAnxiety = Math.round(anxietyValues.reduce((a, b) => a + b, 0) / anxietyValues.length);
    }

    return {
      isTracking: true,
      currentPhase: currentPhase.phase,
      cycleDay: currentPhase.cycleDay,
      daysUntilNextPhase: currentPhase.daysUntilNextPhase,
      recentSymptoms: recentLogs.length > 0 ? { energy: avgEnergy, mood: avgMood, anxiety: avgAnxiety } : undefined,
    };
  }

  // ==========================================
  // PRIVATE HELPER METHODS
  // ==========================================

  private getPhaseForDay(cycleDay: number, cycleLength: number): CyclePhase {
    // Adjust phase boundaries based on actual cycle length
    const ratio = cycleLength / 28;

    const menstrualEnd = Math.round(5 * ratio);
    const follicularEnd = Math.round(13 * ratio);
    const ovulationEnd = Math.round(16 * ratio);

    if (cycleDay <= menstrualEnd) return 'MENSTRUAL';
    if (cycleDay <= follicularEnd) return 'FOLLICULAR';
    if (cycleDay <= ovulationEnd) return 'OVULATION';
    return 'LUTEAL';
  }

  private getDaysUntilNextPhase(cycleDay: number, cycleLength: number): number {
    const ratio = cycleLength / 28;

    const menstrualEnd = Math.round(5 * ratio);
    const follicularEnd = Math.round(13 * ratio);
    const ovulationEnd = Math.round(16 * ratio);

    if (cycleDay <= menstrualEnd) return menstrualEnd - cycleDay + 1;
    if (cycleDay <= follicularEnd) return follicularEnd - cycleDay + 1;
    if (cycleDay <= ovulationEnd) return ovulationEnd - cycleDay + 1;
    return cycleLength - cycleDay + 1;
  }

  private async updateAverageCycleLength(userId: string) {
    const entries = await this.prisma.cycleEntry.findMany({
      where: {
        userId,
        cycleLength: { not: null },
      },
      orderBy: { periodStart: 'desc' },
      take: 6, // Last 6 cycles
    });

    if (entries.length >= 2) {
      const validLengths = entries
        .map((e) => e.cycleLength!)
        .filter((l) => l >= 21 && l <= 45);

      if (validLengths.length >= 2) {
        const average = Math.round(validLengths.reduce((a, b) => a + b, 0) / validLengths.length);
        await this.prisma.cycleSettings.update({
          where: { userId },
          data: { averageCycleLength: average },
        });
      }
    }
  }

  private async updateAveragePeriodLength(userId: string) {
    const entries = await this.prisma.cycleEntry.findMany({
      where: {
        userId,
        periodEnd: { not: null },
      },
      orderBy: { periodStart: 'desc' },
      take: 6,
    });

    if (entries.length >= 2) {
      const lengths = entries.map((e) => {
        const start = new Date(e.periodStart);
        const end = new Date(e.periodEnd!);
        return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      }).filter((l) => l >= 2 && l <= 10);

      if (lengths.length >= 2) {
        const average = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
        await this.prisma.cycleSettings.update({
          where: { userId },
          data: { averagePeriodLength: average },
        });
      }
    }
  }
}
