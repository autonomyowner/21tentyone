'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  api,
  EmdrSession,
  EmdrPhase,
  EmdrGuidance,
  Message,
  EMDR_PHASES_ORDER,
} from '../lib/api';

interface UseEmdrSessionReturn {
  // State
  session: EmdrSession | null;
  messages: Message[];
  currentGuidance: EmdrGuidance | null;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;

  // Bilateral stimulation
  bilateralActive: boolean;
  currentSide: 'left' | 'right';

  // Blink cues
  blinkActive: boolean;
  blinkCount: number;

  // Grounding
  groundingNeeded: boolean;

  // Session timer
  sessionDuration: number;

  // Actions
  startSession: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  advancePhase: () => Promise<void>;
  endSession: (distressEnd: number) => Promise<void>;
  dismissGrounding: () => void;
  triggerBlinks: () => void;
}

export function useEmdrSession(): UseEmdrSessionReturn {
  // Core state
  const [session, setSession] = useState<EmdrSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentGuidance, setCurrentGuidance] = useState<EmdrGuidance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bilateral stimulation state
  const [bilateralActive, setBilateralActive] = useState(false);
  const [currentSide, setCurrentSide] = useState<'left' | 'right'>('left');

  // Blink state
  const [blinkActive, setBlinkActive] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);

  // Grounding state
  const [groundingNeeded, setGroundingNeeded] = useState(false);

  // Session timer
  const [sessionDuration, setSessionDuration] = useState(0);

  // Refs for intervals
  const bilateralIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const blinkSetCountRef = useRef(0);

  const { getToken } = useAuth();

  // Bilateral stimulation effect
  useEffect(() => {
    if (bilateralActive && session) {
      bilateralIntervalRef.current = setInterval(() => {
        setCurrentSide((prev) => (prev === 'left' ? 'right' : 'left'));
      }, session.tapIntervalMs);

      return () => {
        if (bilateralIntervalRef.current) {
          clearInterval(bilateralIntervalRef.current);
        }
      };
    } else {
      if (bilateralIntervalRef.current) {
        clearInterval(bilateralIntervalRef.current);
        bilateralIntervalRef.current = null;
      }
    }
  }, [bilateralActive, session]);

  // Session timer effect
  useEffect(() => {
    if (session && !session.completedAt) {
      timerIntervalRef.current = setInterval(() => {
        const start = new Date(session.startedAt).getTime();
        const now = Date.now();
        setSessionDuration(Math.floor((now - start) / 1000));
      }, 1000);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    }
  }, [session]);

  // Schedule blink cues - smooth and natural
  const scheduleBlinks = useCallback((count: number) => {
    if (!session) return;

    // Clear any existing blink sequence
    if (blinkTimeoutRef.current) {
      clearTimeout(blinkTimeoutRef.current);
    }

    blinkSetCountRef.current = 0;
    const totalBlinks = count;

    const doSingleBlink = () => {
      setBlinkActive(true);
      setBlinkCount(blinkSetCountRef.current + 1);

      // Blink lasts 600ms (matches CSS animation)
      setTimeout(() => {
        setBlinkActive(false);
        blinkSetCountRef.current++;

        if (blinkSetCountRef.current < totalBlinks) {
          // Smooth interval between blinks (800-1200ms for a calm rhythm)
          const nextBlinkDelay = 800 + Math.random() * 400;
          blinkTimeoutRef.current = setTimeout(doSingleBlink, nextBlinkDelay);
        }
      }, 600);
    };

    // Start first blink immediately or with tiny delay
    // The main delay already happened in the useEffect
    const initialDelay = 100 + Math.random() * 200; // Just 100-300ms
    blinkTimeoutRef.current = setTimeout(doSingleBlink, initialDelay);
  }, [session]);

  // Update bilateral/blink states based on guidance
  useEffect(() => {
    if (currentGuidance) {
      setBilateralActive(currentGuidance.shouldShowBilateral);

      if (currentGuidance.groundingNeeded) {
        setGroundingNeeded(true);
        setBilateralActive(false);
      }

      // Trigger blinks with a slight delay so they feel natural during conversation
      if (currentGuidance.shouldShowBlinks) {
        const delay = 800 + Math.random() * 1200; // 800-2000ms delay
        const timeoutId = setTimeout(() => {
          scheduleBlinks(currentGuidance.blinkCount);
        }, delay);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [currentGuidance, scheduleBlinks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bilateralIntervalRef.current) clearInterval(bilateralIntervalRef.current);
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Manually trigger blinks
  const triggerBlinks = useCallback(() => {
    if (session) {
      scheduleBlinks(session.blinksPerSet);
    }
  }, [session, scheduleBlinks]);

  // Start a new EMDR session
  const startSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const response = await api.startEmdrSession(token);

      setSession(response.session);
      setMessages([
        {
          id: response.message.id,
          conversationId: response.conversationId,
          role: response.message.role,
          content: response.message.content,
          createdAt: response.message.createdAt,
        },
      ]);
      setCurrentGuidance(response.guidance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  // Send a message in the EMDR session
  const sendMessage = useCallback(
    async (message: string) => {
      if (!session || isSending) return;

      setIsSending(true);
      setError(null);

      // Add user message optimistically
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId: session.conversationId,
        role: 'USER',
        content: message,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMessage]);

      try {
        const token = await getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await api.sendEmdrMessage(
          token,
          session.conversationId,
          message
        );

        // Replace temp message with real ones
        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => !m.id.startsWith('temp-'));
          return [
            ...withoutTemp,
            {
              ...tempUserMessage,
              id: `user-${Date.now()}`,
            },
            {
              id: response.message.id,
              conversationId: response.conversationId,
              role: response.message.role,
              content: response.message.content,
              createdAt: response.message.createdAt,
            },
          ];
        });

        setSession(response.session);
        setCurrentGuidance(response.guidance);
      } catch (err) {
        // Remove temp message on error
        setMessages((prev) => prev.filter((m) => !m.id.startsWith('temp-')));
        setError(err instanceof Error ? err.message : 'Failed to send message');
      } finally {
        setIsSending(false);
      }
    },
    [session, isSending, getToken]
  );

  // Advance to the next phase
  const advancePhase = useCallback(async () => {
    if (!session) return;

    const currentIndex = EMDR_PHASES_ORDER.indexOf(session.currentPhase);
    if (currentIndex === -1 || currentIndex >= EMDR_PHASES_ORDER.length - 1) return;

    const nextPhase = EMDR_PHASES_ORDER[currentIndex + 1];

    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const updatedSession = await api.updateEmdrPhase(
        token,
        session.conversationId,
        nextPhase
      );

      setSession(updatedSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to advance phase');
    }
  }, [session, getToken]);

  // End the session
  const endSession = useCallback(
    async (distressEnd: number) => {
      if (!session) return;

      try {
        const token = await getToken();
        if (!token) throw new Error('Not authenticated');

        const updatedSession = await api.completeEmdrSession(
          token,
          session.conversationId,
          distressEnd
        );

        setSession(updatedSession);
        setBilateralActive(false);

        // Clear all intervals
        if (bilateralIntervalRef.current) clearInterval(bilateralIntervalRef.current);
        if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to end session');
      }
    },
    [session, getToken]
  );

  // Dismiss grounding overlay
  const dismissGrounding = useCallback(() => {
    setGroundingNeeded(false);
  }, []);

  return {
    session,
    messages,
    currentGuidance,
    isLoading,
    isSending,
    error,
    bilateralActive,
    currentSide,
    blinkActive,
    blinkCount,
    groundingNeeded,
    sessionDuration,
    startSession,
    sendMessage,
    advancePhase,
    endSession,
    dismissGrounding,
    triggerBlinks,
  };
}
