import { z } from 'zod';

export const emdrPhases = [
  'PREPARATION',
  'TRAUMA_RECALL',
  'BILATERAL_START',
  'POSITIVE_RESOURCE',
  'BILATERAL_POSITIVE',
  'INTEGRATION',
  'COMPLETED',
] as const;

export type EmdrPhase = (typeof emdrPhases)[number];

export const startEmdrSessionSchema = z.object({
  conversationId: z.string().optional(),
});

export type StartEmdrSessionDto = z.infer<typeof startEmdrSessionSchema>;

export const sendEmdrMessageSchema = z.object({
  conversationId: z.string(),
  message: z.string().min(1).max(10000),
});

export type SendEmdrMessageDto = z.infer<typeof sendEmdrMessageSchema>;

export const updateEmdrPhaseSchema = z.object({
  phase: z.enum(emdrPhases),
  distressLevel: z.number().min(0).max(10).optional(),
});

export type UpdateEmdrPhaseDto = z.infer<typeof updateEmdrPhaseSchema>;

export const completeEmdrSessionSchema = z.object({
  distressEnd: z.number().min(0).max(10),
});

export type CompleteEmdrSessionDto = z.infer<typeof completeEmdrSessionSchema>;

// Response types
export interface EmdrGuidance {
  shouldShowBilateral: boolean;
  shouldShowBlinks: boolean;
  blinkCount: number;
  suggestedNextPhase: EmdrPhase | null;
  groundingNeeded: boolean;
}

export interface EmdrSessionResponse {
  id: string;
  conversationId: string;
  currentPhase: EmdrPhase;
  blinkIntervalMin: number;
  blinkIntervalMax: number;
  blinksPerSet: number;
  tapIntervalMs: number;
  distressStart: number | null;
  distressEnd: number | null;
  setsCompleted: number;
  startedAt: Date;
  completedAt: Date | null;
}

export interface EmdrMessageResponse {
  conversationId: string;
  message: {
    id: string;
    role: 'USER' | 'ASSISTANT';
    content: string;
    createdAt: Date;
  };
  session: EmdrSessionResponse;
  guidance: EmdrGuidance;
}
