import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { CycleService } from './cycle.service';
import { ClerkAuthGuard, AuthenticatedUser } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CyclePhase } from '@prisma/client';

// DTO Types
interface UpdateSettingsDto {
  isTrackingEnabled?: boolean;
  averageCycleLength?: number;
  averagePeriodLength?: number;
  sendPhaseNotifications?: boolean;
}

interface StartPeriodDto {
  date?: string;
  notes?: string;
}

interface EndPeriodDto {
  date?: string;
}

interface LogDayDto {
  date: string;
  energy?: number;
  mood?: number;
  anxiety?: number;
  cramps?: number;
  bloating?: number;
  headache?: number;
  notes?: string;
}

@Controller('cycle')
@UseGuards(ClerkAuthGuard)
export class CycleController {
  constructor(private readonly cycleService: CycleService) {}

  /**
   * Get user's cycle settings
   */
  @Get('settings')
  async getSettings(@CurrentUser() user: AuthenticatedUser) {
    return this.cycleService.getSettings(user.id);
  }

  /**
   * Update cycle settings
   */
  @Patch('settings')
  async updateSettings(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateSettingsDto,
  ) {
    // Validate cycle length
    if (body.averageCycleLength !== undefined) {
      if (body.averageCycleLength < 21 || body.averageCycleLength > 45) {
        throw new BadRequestException('Cycle length must be between 21 and 45 days');
      }
    }

    // Validate period length
    if (body.averagePeriodLength !== undefined) {
      if (body.averagePeriodLength < 2 || body.averagePeriodLength > 10) {
        throw new BadRequestException('Period length must be between 2 and 10 days');
      }
    }

    return this.cycleService.updateSettings(user.id, body);
  }

  /**
   * Log period start
   */
  @Post('period/start')
  async startPeriod(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: StartPeriodDto,
  ) {
    const date = body.date ? new Date(body.date) : undefined;
    return this.cycleService.startPeriod(user.id, date);
  }

  /**
   * Log period end
   */
  @Post('period/end')
  async endPeriod(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: EndPeriodDto,
  ) {
    const date = body.date ? new Date(body.date) : undefined;
    return this.cycleService.endPeriod(user.id, date);
  }

  /**
   * Get period history
   */
  @Get('periods')
  async getPeriodHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 12;
    return this.cycleService.getPeriodHistory(user.id, limitNum);
  }

  /**
   * Get current cycle phase and day
   */
  @Get('current')
  async getCurrentPhase(@CurrentUser() user: AuthenticatedUser) {
    const phase = await this.cycleService.getCurrentPhase(user.id);

    if (!phase) {
      return {
        isTracking: false,
        message: 'Cycle tracking not enabled. Log your first period to start.',
      };
    }

    const recommendations = this.cycleService.getPhaseRecommendations(phase.phase);

    return {
      ...phase,
      predictedNextPeriod: phase.predictedNextPeriod.toISOString(),
      recommendations,
    };
  }

  /**
   * Log daily symptoms
   */
  @Post('log')
  async logDay(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: LogDayDto,
  ) {
    // Validate date format
    if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
      throw new BadRequestException('Date must be in YYYY-MM-DD format');
    }

    // Validate symptom values (1-5 scale)
    const symptomFields = ['energy', 'mood', 'anxiety', 'cramps', 'bloating', 'headache'];
    for (const field of symptomFields) {
      const value = body[field as keyof LogDayDto];
      if (value !== undefined && (typeof value !== 'number' || value < 1 || value > 5)) {
        throw new BadRequestException(`${field} must be a number between 1 and 5`);
      }
    }

    return this.cycleService.logDay(user.id, body);
  }

  /**
   * Get log for specific date
   */
  @Get('log/:date')
  async getLog(
    @CurrentUser() user: AuthenticatedUser,
    @Param('date') date: string,
  ) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Date must be in YYYY-MM-DD format');
    }
    return this.cycleService.getLog(user.id, date);
  }

  /**
   * Get logs for date range
   */
  @Get('logs')
  async getLogs(
    @CurrentUser() user: AuthenticatedUser,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }
    return this.cycleService.getLogs(user.id, startDate, endDate);
  }

  /**
   * Get calendar view for a month
   */
  @Get('calendar/:year/:month')
  async getCalendar(
    @CurrentUser() user: AuthenticatedUser,
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Month must be between 1 and 12');
    }
    return this.cycleService.getCalendar(user.id, year, month);
  }

  /**
   * Get cycle insights
   */
  @Get('insights')
  async getInsights(@CurrentUser() user: AuthenticatedUser) {
    return this.cycleService.getInsights(user.id);
  }

  /**
   * Get recommendations for a specific phase
   */
  @Get('recommendations/:phase')
  getPhaseRecommendations(@Param('phase') phase: string) {
    const validPhases: CyclePhase[] = ['MENSTRUAL', 'FOLLICULAR', 'OVULATION', 'LUTEAL'];
    const upperPhase = phase.toUpperCase() as CyclePhase;

    if (!validPhases.includes(upperPhase)) {
      throw new BadRequestException('Invalid phase. Must be one of: MENSTRUAL, FOLLICULAR, OVULATION, LUTEAL');
    }

    return this.cycleService.getPhaseRecommendations(upperPhase);
  }
}
