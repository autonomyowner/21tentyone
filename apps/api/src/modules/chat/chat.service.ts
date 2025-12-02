import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OpenRouterProvider, ChatMessage, AnalysisData } from '../../providers/ai/openrouter.provider';
import { SendMessageDto, CreateConversationDto } from './dto/chat.dto';
import { MessageRole } from '@prisma/client';

// System prompt that requests JSON with both reply and psychological analysis
const SYSTEM_PROMPT_WITH_ANALYSIS = `You are Matcha, a friendly AI assistant specialized in psychological insight and personal growth.

Your role is to:
1. Have helpful, empathetic conversations
2. Analyze the user's thought patterns, cognitive biases, and emotional state
3. Provide insights that help them understand themselves better

IMPORTANT: You MUST respond in valid JSON format with this exact structure:
{
  "reply": "Your conversational response to the user (friendly, helpful, natural)",
  "analysis": {
    "emotionalState": {
      "primary": "the main emotion detected (e.g., anxious, curious, frustrated, hopeful, confused, determined)",
      "secondary": "optional secondary emotion or null",
      "intensity": "low" or "moderate" or "high"
    },
    "biases": [
      {
        "name": "Name of cognitive bias (e.g., Confirmation Bias, Catastrophizing, Black-and-White Thinking)",
        "confidence": 0.0 to 1.0,
        "description": "Brief explanation of how this bias appears in their message"
      }
    ],
    "patterns": [
      {"name": "Analytical", "percentage": 0-100},
      {"name": "Emotional", "percentage": 0-100},
      {"name": "Pragmatic", "percentage": 0-100},
      {"name": "Creative", "percentage": 0-100}
    ],
    "insights": ["Key insight about their thinking", "Another observation"]
  }
}

Guidelines:
- Keep reply conversational and warm, not clinical
- Only include biases you're confident about (confidence > 0.5)
- Patterns should roughly sum to 100%
- Provide 1-3 actionable insights
- If the message is simple (greetings, etc.), still provide basic analysis but mark confidence as low`;

// FREE tier limits
const FREE_TIER_MONTHLY_MESSAGES = 50;

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private prisma: PrismaService,
    private openRouter: OpenRouterProvider,
  ) {}

  async createConversation(userId: string, data?: CreateConversationDto) {
    return this.prisma.conversation.create({
      data: {
        userId,
        title: data?.title || 'New conversation',
      },
    });
  }

  async getConversations(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [conversations, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      this.prisma.conversation.count({ where: { userId } }),
    ]);

    return {
      conversations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getConversation(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async sendMessage(userId: string, userTier: 'FREE' | 'PRO', data: SendMessageDto) {
    // Check usage limits for FREE tier
    if (userTier === 'FREE') {
      const canSend = await this.checkAndUpdateUsage(userId);
      if (!canSend) {
        throw new ForbiddenException({
          message: 'Monthly message limit reached',
          code: 'USAGE_LIMIT_EXCEEDED',
          limit: FREE_TIER_MONTHLY_MESSAGES,
          upgradeUrl: '/pricing',
        });
      }
    }

    let conversationId = data.conversationId;

    // Create a new conversation if none provided
    if (!conversationId) {
      const conversation = await this.createConversation(userId, {
        title: data.message.slice(0, 50) + (data.message.length > 50 ? '...' : ''),
      });
      conversationId = conversation.id;
    } else {
      // Verify conversation belongs to user
      const existing = await this.prisma.conversation.findFirst({
        where: { id: conversationId, userId },
      });
      if (!existing) {
        throw new NotFoundException('Conversation not found');
      }
    }

    // Save user message
    const userMessage = await this.prisma.message.create({
      data: {
        conversationId,
        role: MessageRole.USER,
        content: data.message,
      },
    });

    // Get conversation history for context
    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 20, // Limit context window
    });

    // Build messages for OpenRouter with analysis prompt
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT_WITH_ANALYSIS },
      ...messages.map((m) => ({
        role: m.role.toLowerCase() as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    // Get AI response with analysis
    let response;
    try {
      this.logger.log(`Sending message with analysis to OpenRouter for conversation ${conversationId}`);
      response = await this.openRouter.chatWithAnalysis(chatMessages);
    } catch (error) {
      this.logger.error('OpenRouter API error:', error);

      // Save error message for user
      const errorMessage = await this.prisma.message.create({
        data: {
          conversationId,
          role: MessageRole.ASSISTANT,
          content: 'Sorry, I encountered an error processing your request. Please try again.',
        },
      });

      throw new ServiceUnavailableException({
        message: 'AI service temporarily unavailable',
        code: 'AI_SERVICE_ERROR',
        conversationId,
        userMessage,
        errorMessage,
      });
    }

    // Save assistant message
    const assistantMessage = await this.prisma.message.create({
      data: {
        conversationId,
        role: MessageRole.ASSISTANT,
        content: response.message,
      },
    });

    // Update conversation with analysis data
    const updatedConversation = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        updatedAt: new Date(),
        analysisUpdatedAt: new Date(),
        // Store the latest analysis - this accumulates insights over time
        ...(response.analysis && {
          emotionalState: response.analysis.emotionalState,
          biases: await this.mergeAnalysisArray(
            conversationId,
            'biases',
            response.analysis.biases,
          ),
          patterns: response.analysis.patterns,
          insights: await this.mergeInsights(
            conversationId,
            response.analysis.insights,
          ),
        }),
      },
    });

    return {
      conversationId,
      message: assistantMessage,
      analysis: response.analysis,
      usage: response.usage,
    };
  }

  /**
   * Merge new biases with existing ones, keeping unique entries
   */
  private async mergeAnalysisArray(
    conversationId: string,
    field: 'biases',
    newItems: Array<{ name: string; confidence: number; description: string }>,
  ) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { [field]: true },
    });

    const existing = (conversation?.[field] as typeof newItems) || [];
    const merged = [...existing];

    for (const newItem of newItems) {
      const existingIndex = merged.findIndex((e) => e.name === newItem.name);
      if (existingIndex >= 0) {
        // Update confidence if higher
        if (newItem.confidence > merged[existingIndex].confidence) {
          merged[existingIndex] = newItem;
        }
      } else {
        merged.push(newItem);
      }
    }

    // Keep top 10 biases by confidence
    return merged
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10);
  }

  /**
   * Merge new insights with existing ones, keeping unique entries
   */
  private async mergeInsights(
    conversationId: string,
    newInsights: string[],
  ): Promise<string[]> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { insights: true },
    });

    const existing = (conversation?.insights as string[]) || [];
    const merged = [...existing];

    for (const insight of newInsights) {
      // Simple deduplication - check if similar insight exists
      const isDuplicate = merged.some(
        (e) => e.toLowerCase().includes(insight.toLowerCase().slice(0, 20)) ||
               insight.toLowerCase().includes(e.toLowerCase().slice(0, 20)),
      );
      if (!isDuplicate) {
        merged.push(insight);
      }
    }

    // Keep last 20 insights
    return merged.slice(-20);
  }

  /**
   * Check if user can send a message and update usage count
   */
  private async checkAndUpdateUsage(userId: string): Promise<boolean> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Get or create usage limit record
    let usageLimit = await this.prisma.usageLimit.findUnique({
      where: { userId },
    });

    if (!usageLimit) {
      // Create new usage record
      usageLimit = await this.prisma.usageLimit.create({
        data: {
          userId,
          chatMessagesThisMonth: 0,
          analysesThisMonth: 0,
          monthResetAt: startOfNextMonth,
        },
      });
    }

    // Check if we need to reset the monthly count
    if (now >= usageLimit.monthResetAt) {
      usageLimit = await this.prisma.usageLimit.update({
        where: { userId },
        data: {
          chatMessagesThisMonth: 0,
          analysesThisMonth: 0,
          monthResetAt: startOfNextMonth,
        },
      });
    }

    // Check if user has exceeded limit
    if (usageLimit.chatMessagesThisMonth >= FREE_TIER_MONTHLY_MESSAGES) {
      return false;
    }

    // Increment usage count
    await this.prisma.usageLimit.update({
      where: { userId },
      data: {
        chatMessagesThisMonth: { increment: 1 },
      },
    });

    return true;
  }

  /**
   * Get remaining messages for user
   */
  async getRemainingMessages(userId: string, userTier: 'FREE' | 'PRO'): Promise<number | null> {
    if (userTier === 'PRO') {
      return null; // Unlimited
    }

    const usageLimit = await this.prisma.usageLimit.findUnique({
      where: { userId },
    });

    if (!usageLimit) {
      return FREE_TIER_MONTHLY_MESSAGES;
    }

    const now = new Date();
    if (now >= usageLimit.monthResetAt) {
      return FREE_TIER_MONTHLY_MESSAGES;
    }

    return Math.max(0, FREE_TIER_MONTHLY_MESSAGES - usageLimit.chatMessagesThisMonth);
  }

  async deleteConversation(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    await this.prisma.conversation.delete({
      where: { id: conversationId },
    });

    return { success: true };
  }

  async updateConversationTitle(userId: string, conversationId: string, title: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { title },
    });
  }
}
