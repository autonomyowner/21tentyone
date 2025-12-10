import { create } from 'zustand';
import type { DashboardData, Conversation, Analysis } from '../lib/api';

interface AppState {
  // Dashboard
  dashboard: DashboardData | null;
  setDashboard: (data: DashboardData | null) => void;

  // Conversations
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (id: string) => void;

  // Active conversation
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation | null) => void;

  // Current analysis (from last message)
  currentAnalysis: Analysis | null;
  setCurrentAnalysis: (analysis: Analysis | null) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Dashboard
  dashboard: null,
  setDashboard: (data) => set({ dashboard: data }),

  // Conversations
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  addConversation: (conversation) =>
    set((state) => ({ conversations: [conversation, ...state.conversations] })),
  removeConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
    })),

  // Active conversation
  activeConversation: null,
  setActiveConversation: (conversation) => set({ activeConversation: conversation }),

  // Current analysis
  currentAnalysis: null,
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

  // Loading states
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Error state
  error: null,
  setError: (error) => set({ error }),
}));
