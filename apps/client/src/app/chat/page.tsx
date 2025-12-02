'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useLanguage } from '../../components/LanguageProvider';
import { api, Conversation, Message, AnalysisData } from '../../lib/api';

export default function ChatPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { t } = useLanguage();

  const [conversations, setConversations] = useState<(Conversation & { messages: Message[] })[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [analysisPanelOpen, setAnalysisPanelOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/login');
    }
  }, [isSignedIn, isLoaded, router]);

  const loadConversations = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      setIsLoading(true);
      const response = await api.getConversations(token);
      setConversations(response.conversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (isSignedIn) {
      loadConversations();
    }
  }, [isSignedIn, loadConversations]);

  const loadConversation = async (conversationId: string) => {
    try {
      const token = await getToken();
      if (!token) return;

      setIsLoading(true);
      const conversation = await api.getConversation(token, conversationId);
      setActiveConversationId(conversationId);
      setMessages(conversation.messages || []);

      // Load existing analysis from conversation
      if (conversation.emotionalState || conversation.biases || conversation.patterns) {
        setCurrentAnalysis({
          emotionalState: conversation.emotionalState || { primary: 'neutral', intensity: 'low' },
          biases: conversation.biases || [],
          patterns: conversation.patterns || [],
          insights: conversation.insights || [],
        });
      } else {
        setCurrentAnalysis(null);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
    setCurrentAnalysis(null);
    inputRef.current?.focus();
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isSending) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsSending(true);

    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId: activeConversationId || '',
      role: 'USER',
      content: userMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const token = await getToken();
      if (!token) return;

      const response = await api.sendMessage(token, userMessage, activeConversationId || undefined);

      if (!activeConversationId) {
        setActiveConversationId(response.conversationId);
        loadConversations();
      }

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMessage.id),
        { ...tempUserMessage, id: `user-${Date.now()}`, conversationId: response.conversationId },
        response.message,
      ]);

      // Update analysis with new data
      if (response.analysis) {
        setCurrentAnalysis(response.analysis);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
      setInputValue(userMessage);
    } finally {
      setIsSending(false);
    }
  };

  const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = await getToken();
      if (!token) return;

      await api.deleteConversation(token, conversationId);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));

      if (activeConversationId === conversationId) {
        startNewConversation();
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream-50)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  const intensityColors = {
    low: 'var(--matcha-400)',
    moderate: 'var(--terra-400)',
    high: 'var(--terra-600)',
  };

  return (
    <div className="h-screen flex" style={{ background: 'var(--cream-50)' }}>
      {/* Conversations Sidebar */}
      <div
        className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 flex-shrink-0 overflow-hidden`}
        style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border-soft)' }}
      >
        <div className="h-full flex flex-col w-72">
          <div className="p-4 border-b" style={{ borderColor: 'var(--border-soft)' }}>
            <button
              onClick={startNewConversation}
              className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all"
              style={{
                background: 'linear-gradient(135deg, var(--matcha-500) 0%, var(--matcha-600) 100%)',
                color: 'var(--text-inverse)',
                boxShadow: '0 4px 14px rgba(104, 166, 125, 0.35)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              {t.chat?.newChat || 'New Chat'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {isLoading && conversations.length === 0 ? (
              <div className="p-4 text-center" style={{ color: 'var(--text-muted)' }}>Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center" style={{ color: 'var(--text-muted)' }}>
                {t.chat?.noConversations || 'No conversations yet'}
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className={`group p-3 rounded-xl mb-1 cursor-pointer transition-all flex items-center justify-between ${
                    activeConversationId === conv.id ? 'bg-[var(--matcha-50)]' : 'hover:bg-[var(--cream-100)]'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {conv.title || 'New conversation'}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                      {conv.messages?.[0]?.content?.slice(0, 30) || ''}
                      {(conv.messages?.[0]?.content?.length || 0) > 30 ? '...' : ''}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div
          className="h-16 flex items-center justify-between px-4 flex-shrink-0"
          style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-soft)' }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--cream-100)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <h1 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
              {t.chat?.title || 'Chat with Matcha AI'}
            </h1>
          </div>
          <button
            onClick={() => setAnalysisPanelOpen(!analysisPanelOpen)}
            className={`p-2 rounded-lg transition-colors ${analysisPanelOpen ? 'bg-[var(--matcha-100)]' : 'hover:bg-[var(--cream-100)]'}`}
            style={{ color: analysisPanelOpen ? 'var(--matcha-600)' : 'var(--text-secondary)' }}
            title="Toggle Analysis Panel"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-3xl mx-auto">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--matcha-100)' }}
                      >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--matcha-600)" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <h2
                        className="text-xl mb-2"
                        style={{ fontFamily: 'var(--font-dm-serif), Georgia, serif', color: 'var(--text-primary)' }}
                      >
                        {t.chat?.welcomeTitle || 'Start a conversation'}
                      </h2>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        {t.chat?.welcomeSubtitle || "Ask me anything and I'll help you out"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${message.role === 'USER' ? 'rounded-br-md' : 'rounded-bl-md'}`}
                          style={{
                            background: message.role === 'USER'
                              ? 'linear-gradient(135deg, var(--matcha-500) 0%, var(--matcha-600) 100%)'
                              : 'var(--bg-card)',
                            color: message.role === 'USER' ? 'var(--text-inverse)' : 'var(--text-primary)',
                            border: message.role === 'USER' ? 'none' : '1px solid var(--border-soft)',
                            boxShadow: 'var(--shadow-sm)',
                          }}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isSending && (
                      <div className="flex justify-start">
                        <div className="p-4 rounded-2xl rounded-bl-md" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-[var(--matcha-400)] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-[var(--matcha-400)] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-[var(--matcha-400)] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 flex-shrink-0" style={{ background: 'var(--cream-50)' }}>
              <div className="max-w-3xl mx-auto">
                <div
                  className="flex items-end gap-3 p-3 rounded-2xl"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-md)' }}
                >
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.chat?.inputPlaceholder || 'Type your message...'}
                    className="flex-1 resize-none bg-transparent outline-none max-h-32"
                    style={{ color: 'var(--text-primary)' }}
                    rows={1}
                    disabled={isSending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isSending}
                    className="p-3 rounded-xl transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, var(--matcha-500) 0%, var(--matcha-600) 100%)', color: 'var(--text-inverse)' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Analysis Panel */}
          <div
            className={`${analysisPanelOpen ? 'w-80' : 'w-0'} transition-all duration-300 flex-shrink-0 overflow-hidden`}
            style={{ background: 'var(--bg-card)', borderLeft: '1px solid var(--border-soft)' }}
          >
            <div className="h-full flex flex-col w-80 overflow-y-auto">
              <div className="p-4 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--matcha-500)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4M12 8h.01"></path>
                  </svg>
                  Real-time Analysis
                </h2>
              </div>

              {!currentAnalysis ? (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: 'var(--cream-200)' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Analysis will appear here as you chat
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-6">
                  {/* Emotional State */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                      Emotional State
                    </h3>
                    <div className="p-3 rounded-xl" style={{ background: 'var(--cream-100)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                          {currentAnalysis.emotionalState.primary}
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-full capitalize"
                          style={{
                            background: `${intensityColors[currentAnalysis.emotionalState.intensity]}20`,
                            color: intensityColors[currentAnalysis.emotionalState.intensity],
                          }}
                        >
                          {currentAnalysis.emotionalState.intensity}
                        </span>
                      </div>
                      {currentAnalysis.emotionalState.secondary && (
                        <p className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>
                          Secondary: {currentAnalysis.emotionalState.secondary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Thinking Patterns */}
                  {currentAnalysis.patterns && currentAnalysis.patterns.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                        Thinking Patterns
                      </h3>
                      <div className="space-y-3">
                        {currentAnalysis.patterns.map((pattern, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span style={{ color: 'var(--text-primary)' }}>{pattern.name}</span>
                              <span style={{ color: 'var(--matcha-600)' }}>{pattern.percentage}%</span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--cream-200)' }}>
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${pattern.percentage}%`,
                                  background: 'linear-gradient(90deg, var(--matcha-400), var(--matcha-600))',
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cognitive Biases */}
                  {currentAnalysis.biases && currentAnalysis.biases.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                        Cognitive Biases Detected
                      </h3>
                      <div className="space-y-2">
                        {currentAnalysis.biases.map((bias, i) => (
                          <div key={i} className="p-3 rounded-xl" style={{ background: 'var(--cream-100)' }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                                {bias.name}
                              </span>
                              <span className="text-xs" style={{ color: 'var(--terra-500)' }}>
                                {Math.round(bias.confidence * 100)}%
                              </span>
                            </div>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              {bias.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insights */}
                  {currentAnalysis.insights && currentAnalysis.insights.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                        Key Insights
                      </h3>
                      <div className="space-y-2">
                        {currentAnalysis.insights.map((insight, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl text-sm"
                            style={{
                              background: 'linear-gradient(135deg, var(--matcha-50), var(--cream-100))',
                              borderLeft: '3px solid var(--matcha-500)',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {insight}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Analysis Complete Badge */}
                  <div className="pt-4 border-t" style={{ borderColor: 'var(--border-soft)' }}>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--matcha-600)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Analysis complete
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
