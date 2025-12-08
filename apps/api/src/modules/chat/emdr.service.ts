import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OpenRouterProvider, ChatMessage } from '../../providers/ai/openrouter.provider';
import {
  SendEmdrMessageDto,
  UpdateEmdrPhaseDto,
  CompleteEmdrSessionDto,
  EmdrPhase,
  EmdrGuidance,
  EmdrSessionResponse,
  EmdrMessageResponse,
} from './dto/emdr.dto';
import { getEmdrSystemPrompt, getNextPhase, EMDR_PHASES_ORDER } from './prompts/emdr-prompt';
import { MessageRole, SessionType, EmdrPhase as PrismaEmdrPhase } from '@prisma/client';

// FREE tier limits
const FREE_TIER_MONTHLY_MESSAGES = 50;

@Injectable()
export class EmdrService {
  private readonly logger = new Logger(EmdrService.name);

  constructor(
    private prisma: PrismaService,
    private openRouter: OpenRouterProvider,
  ) {}

  /**
   * Start a new EMDR Flash session
   */
  async startSession(userId: string, userTier: 'FREE' | 'PRO'): Promise<EmdrMessageResponse> {
    // Check usage limits for FREE tier
    if (userTier === 'FREE') {
      const canSend = await this.checkUsageAvailable(userId);
      if (!canSend) {
        throw new ForbiddenException({
          message: 'Monthly message limit reached',
          code: 'USAGE_LIMIT_EXCEEDED',
          limit: FREE_TIER_MONTHLY_MESSAGES,
          upgradeUrl: '/pricing',
        });
      }
    }

    // Create conversation with EMDR_FLASH type
    const conversation = await this.prisma.conversation.create({
      data: {
        userId,
        title: 'Flash Technique Session',
        sessionType: SessionType.EMDR_FLASH,
      },
    });

    // Create EMDR session record
    const emdrSession = await this.prisma.emdrSession.create({
      data: {
        conversationId: conversation.id,
        currentPhase: PrismaEmdrPhase.PREPARATION,
      },
    });

    // Get initial AI greeting
    const systemPrompt = getEmdrSystemPrompt('PREPARATION');
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'I would like to start a Flash Technique session.' },
    ];

    let aiResponse;
    try {
      aiResponse = await this.openRouter.chatWithAnalysis(chatMessages);
    } catch (error) {
      this.logger.error('OpenRouter API error:', error);
      throw new ServiceUnavailableException('AI service temporarily unavailable');
    }

    // Parse the EMDR guidance from response
    let parsedResponse: { reply: string; guidance: EmdrGuidance; analysis: unknown };
    try {
      parsedResponse = JSON.parse(aiResponse.message);
      if (!parsedResponse.reply) {
        parsedResponse = {
          reply: aiResponse.message,
          guidance: {
            shouldShowBilateral: false,
            shouldShowBlinks: false,
            blinkCount: 5,
            suggestedNextPhase: null,
            groundingNeeded: false,
          },
          analysis: {},
        };
      }
    } catch {
      parsedResponse = {
        reply: aiResponse.message,
        guidance: {
          shouldShowBilateral: false,
          shouldShowBlinks: false,
          blinkCount: 5,
          suggestedNextPhase: null,
          groundingNeeded: false,
        },
        analysis: {},
      };
    }

    // Save AI message
    const assistantMessage = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: MessageRole.ASSISTANT,
        content: parsedResponse.reply,
      },
    });

    // Update usage
    if (userTier === 'FREE') {
      await this.incrementUsage(userId);
    }

    return {
      conversationId: conversation.id,
      message: {
        id: assistantMessage.id,
        role: 'ASSISTANT',
        content: parsedResponse.reply,
        createdAt: assistantMessage.createdAt,
      },
      session: this.formatSessionResponse(emdrSession),
      guidance: parsedResponse.guidance,
    };
  }

  /**
   * Count turns in a specific phase
   */
  private countTurnsInPhase(messages: { role: string; content: string }[], phase: EmdrPhase): number {
    // Count user messages since we entered a positive phase
    // This is a simple heuristic - count from when bilateral likely started
    let turnCount = 0;
    let inBilateralPhase = false;

    for (const msg of messages) {
      // Look for indicators we've entered positive phase
      if (msg.role === 'assistant' && (
        msg.content.toLowerCase().includes('positive') ||
        msg.content.toLowerCase().includes('peaceful') ||
        msg.content.toLowerCase().includes('happy memory') ||
        msg.content.toLowerCase().includes('safe place')
      )) {
        inBilateralPhase = true;
      }

      if (inBilateralPhase && msg.role === 'user') {
        turnCount++;
      }
    }

    return turnCount;
  }

  /**
   * Get phase-appropriate guidance with turn awareness
   */
  private getPhaseGuidance(phase: EmdrPhase, turnCount: number): Partial<EmdrGuidance> {
    const isPositivePhase = ['POSITIVE_RESOURCE', 'BILATERAL_POSITIVE'].includes(phase);

    if (isPositivePhase) {
      return {
        shouldShowBilateral: true,
        shouldShowBlinks: turnCount > 0, // Blinks after first response
        blinkCount: 5,
        suggestedNextPhase: turnCount >= 4 ? 'INTEGRATION' :
                           (turnCount >= 2 && phase === 'POSITIVE_RESOURCE' ? 'BILATERAL_POSITIVE' : null),
        groundingNeeded: false,
      };
    }

    return {
      shouldShowBilateral: false,
      shouldShowBlinks: false,
      blinkCount: 5,
      suggestedNextPhase: null,
      groundingNeeded: false,
    };
  }

  /**
   * Send a message in an EMDR session
   */
  async sendMessage(
    userId: string,
    userTier: 'FREE' | 'PRO',
    data: SendEmdrMessageDto,
  ): Promise<EmdrMessageResponse> {
    // Check usage limits
    if (userTier === 'FREE') {
      const canSend = await this.checkUsageAvailable(userId);
      if (!canSend) {
        throw new ForbiddenException({
          message: 'Monthly message limit reached',
          code: 'USAGE_LIMIT_EXCEEDED',
          limit: FREE_TIER_MONTHLY_MESSAGES,
          upgradeUrl: '/pricing',
        });
      }
    }

    // Verify conversation exists and belongs to user
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: data.conversationId,
        userId,
        sessionType: SessionType.EMDR_FLASH,
      },
      include: {
        emdrSession: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('EMDR session not found');
    }

    if (!conversation.emdrSession) {
      throw new BadRequestException('This conversation is not an EMDR session');
    }

    const emdrSession = conversation.emdrSession;

    if (emdrSession.currentPhase === PrismaEmdrPhase.COMPLETED) {
      throw new BadRequestException('This session has been completed');
    }

    // Save user message
    const userMessage = await this.prisma.message.create({
      data: {
        conversationId: data.conversationId,
        role: MessageRole.USER,
        content: data.message,
      },
    });

    // Get conversation history
    const messages = await this.prisma.message.findMany({
      where: { conversationId: data.conversationId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    // Count turns in current phase for context
    const turnCount = this.countTurnsInPhase(
      messages.map(m => ({ role: m.role.toLowerCase(), content: m.content })),
      emdrSession.currentPhase as EmdrPhase
    );

    // Build messages for AI with turn-aware prompt
    const systemPrompt = getEmdrSystemPrompt(emdrSession.currentPhase as EmdrPhase, turnCount);
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role.toLowerCase() as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    let aiResponse;
    try {
      aiResponse = await this.openRouter.chatWithAnalysis(chatMessages);
    } catch (error) {
      this.logger.error('OpenRouter API error:', error);
      throw new ServiceUnavailableException('AI service temporarily unavailable');
    }

    // Parse the response
    let parsedResponse: { reply: string; guidance: EmdrGuidance };
    try {
      parsedResponse = JSON.parse(aiResponse.message);
      if (!parsedResponse.reply) {
        throw new Error('No reply in response');
      }
      // Ensure guidance has all required fields
      parsedResponse.guidance = {
        shouldShowBilateral: parsedResponse.guidance?.shouldShowBilateral ?? this.shouldShowBilateral(emdrSession.currentPhase as EmdrPhase),
        shouldShowBlinks: parsedResponse.guidance?.shouldShowBlinks ?? this.shouldShowBlinks(emdrSession.currentPhase as EmdrPhase),
        blinkCount: parsedResponse.guidance?.blinkCount ?? 5,
        suggestedNextPhase: parsedResponse.guidance?.suggestedNextPhase ?? null,
        groundingNeeded: parsedResponse.guidance?.groundingNeeded ?? false,
      };
    } catch {
      // AI didn't return valid JSON - use fallback with phase-aware guidance
      const fallbackGuidance = this.getPhaseGuidance(emdrSession.currentPhase as EmdrPhase, turnCount);

      // Try to extract just the text if JSON parsing failed
      let replyText = aiResponse.message;
      // Sometimes AI wraps response in markdown code blocks
      const jsonMatch = replyText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          const innerJson = JSON.parse(jsonMatch[1]);
          replyText = innerJson.reply || replyText;
        } catch {
          // Keep original text
        }
      }

      parsedResponse = {
        reply: replyText,
        guidance: {
          shouldShowBilateral: fallbackGuidance.shouldShowBilateral ?? false,
          shouldShowBlinks: fallbackGuidance.shouldShowBlinks ?? false,
          blinkCount: 5,
          suggestedNextPhase: fallbackGuidance.suggestedNextPhase ?? null,
          groundingNeeded: false,
        },
      };
    }

    // Save AI message
    const assistantMessage = await this.prisma.message.create({
      data: {
        conversationId: data.conversationId,
        role: MessageRole.ASSISTANT,
        content: parsedResponse.reply,
      },
    });

    // Auto-advance phase if suggested
    let updatedSession = emdrSession;
    if (parsedResponse.guidance.suggestedNextPhase) {
      const nextPhase = parsedResponse.guidance.suggestedNextPhase as PrismaEmdrPhase;
      if (EMDR_PHASES_ORDER.includes(nextPhase as EmdrPhase)) {
        updatedSession = await this.prisma.emdrSession.update({
          where: { id: emdrSession.id },
          data: { currentPhase: nextPhase },
        });
        this.logger.log(`Phase auto-advanced from ${emdrSession.currentPhase} to ${nextPhase}`);
      }
    }

    // Update usage
    if (userTier === 'FREE') {
      await this.incrementUsage(userId);
    }

    return {
      conversationId: data.conversationId,
      message: {
        id: assistantMessage.id,
        role: 'ASSISTANT',
        content: parsedResponse.reply,
        createdAt: assistantMessage.createdAt,
      },
      session: this.formatSessionResponse(updatedSession),
      guidance: parsedResponse.guidance,
    };
  }

  /**
   * Update the session phase manually
   */
  async updatePhase(
    userId: string,
    conversationId: string,
    data: UpdateEmdrPhaseDto,
  ): Promise<EmdrSessionResponse> {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
        sessionType: SessionType.EMDR_FLASH,
      },
      include: { emdrSession: true },
    });

    if (!conversation?.emdrSession) {
      throw new NotFoundException('EMDR session not found');
    }

    const updateData: Record<string, unknown> = {
      currentPhase: data.phase as PrismaEmdrPhase,
    };

    // Store distress level if provided
    if (data.distressLevel !== undefined) {
      const currentPhase = conversation.emdrSession.currentPhase;
      if (currentPhase === PrismaEmdrPhase.PREPARATION) {
        updateData.distressStart = data.distressLevel;
      } else if (currentPhase === PrismaEmdrPhase.INTEGRATION) {
        updateData.distressEnd = data.distressLevel;
      }
    }

    const updatedSession = await this.prisma.emdrSession.update({
      where: { id: conversation.emdrSession.id },
      data: updateData,
    });

    return this.formatSessionResponse(updatedSession);
  }

  /**
   * Get the current EMDR session state
   */
  async getSession(userId: string, conversationId: string): Promise<{
    session: EmdrSessionResponse;
    conversation: unknown;
  }> {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
        sessionType: SessionType.EMDR_FLASH,
      },
      include: {
        emdrSession: true,
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation?.emdrSession) {
      throw new NotFoundException('EMDR session not found');
    }

    return {
      session: this.formatSessionResponse(conversation.emdrSession),
      conversation: {
        id: conversation.id,
        title: conversation.title,
        messages: conversation.messages,
        createdAt: conversation.createdAt,
      },
    };
  }

  /**
   * Complete the EMDR session
   */
  async completeSession(
    userId: string,
    conversationId: string,
    data: CompleteEmdrSessionDto,
  ): Promise<EmdrSessionResponse> {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
        sessionType: SessionType.EMDR_FLASH,
      },
      include: { emdrSession: true },
    });

    if (!conversation?.emdrSession) {
      throw new NotFoundException('EMDR session not found');
    }

    const updatedSession = await this.prisma.emdrSession.update({
      where: { id: conversation.emdrSession.id },
      data: {
        currentPhase: PrismaEmdrPhase.COMPLETED,
        distressEnd: data.distressEnd,
        completedAt: new Date(),
      },
    });

    return this.formatSessionResponse(updatedSession);
  }

  /**
   * Check if user has usage available
   */
  private async checkUsageAvailable(userId: string): Promise<boolean> {
    const now = new Date();
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    let usageLimit = await this.prisma.usageLimit.findUnique({
      where: { userId },
    });

    if (!usageLimit) {
      return true; // New user, hasn't hit limit
    }

    // Check if we need to reset
    if (now >= usageLimit.monthResetAt) {
      return true; // Month reset
    }

    return usageLimit.chatMessagesThisMonth < FREE_TIER_MONTHLY_MESSAGES;
  }

  /**
   * Increment usage count
   */
  private async incrementUsage(userId: string): Promise<void> {
    const now = new Date();
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    await this.prisma.usageLimit.upsert({
      where: { userId },
      create: {
        userId,
        chatMessagesThisMonth: 1,
        analysesThisMonth: 0,
        monthResetAt: startOfNextMonth,
      },
      update: {
        chatMessagesThisMonth: { increment: 1 },
      },
    });
  }

  /**
   * Determine if bilateral stimulation should show for a phase
   */
  private shouldShowBilateral(phase: EmdrPhase): boolean {
    return ['BILATERAL_START', 'BILATERAL_POSITIVE'].includes(phase);
  }

  /**
   * Determine if blink cues should show for a phase
   */
  private shouldShowBlinks(phase: EmdrPhase): boolean {
    return ['BILATERAL_START', 'BILATERAL_POSITIVE'].includes(phase);
  }

  /**
   * Format EmdrSession for response
   */
  private formatSessionResponse(session: {
    id: string;
    conversationId: string;
    currentPhase: PrismaEmdrPhase;
    blinkIntervalMin: number;
    blinkIntervalMax: number;
    blinksPerSet: number;
    tapIntervalMs: number;
    distressStart: number | null;
    distressEnd: number | null;
    setsCompleted: number;
    startedAt: Date;
    completedAt: Date | null;
  }): EmdrSessionResponse {
    return {
      id: session.id,
      conversationId: session.conversationId,
      currentPhase: session.currentPhase as EmdrPhase,
      blinkIntervalMin: session.blinkIntervalMin,
      blinkIntervalMax: session.blinkIntervalMax,
      blinksPerSet: session.blinksPerSet,
      tapIntervalMs: session.tapIntervalMs,
      distressStart: session.distressStart,
      distressEnd: session.distressEnd,
      setsCompleted: session.setsCompleted,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
    };
  }
}
