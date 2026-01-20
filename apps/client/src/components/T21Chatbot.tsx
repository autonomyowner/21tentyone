'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export function T21Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [hasProvidedEmail, setHasProvidedEmail] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = useAction(api.chatbot.sendMessage);
  const captureAILead = useMutation(api.chat.captureAILead);
  const conversationHistory = useQuery(
    api.chat.getConversationHistory,
    sessionId ? { sessionId } : 'skip'
  );

  // Generate session ID on mount
  useEffect(() => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(id);

    // Check if email was already provided in this browser session
    const storedEmail = localStorage.getItem('t21_chat_email');
    if (storedEmail) {
      setHasProvidedEmail(true);
    }
  }, []);

  // Load conversation history when session starts
  useEffect(() => {
    if (conversationHistory && conversationHistory.length > 0) {
      setMessages(conversationHistory);
    } else if (isOpen && messages.length === 0) {
      // Show welcome message
      setMessages([
        {
          role: 'assistant',
          content:
            "Hi! I'm T21, your friendly guide to understanding attachment styles and healing. How can I help you today?",
          createdAt: Date.now(),
        },
      ]);
    }
  }, [conversationHistory, isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show email prompt after 3 messages if not provided
  useEffect(() => {
    if (!hasProvidedEmail && messages.length >= 6 && !showEmailPrompt) {
      setShowEmailPrompt(true);
    }
  }, [messages.length, hasProvidedEmail, showEmailPrompt]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message to UI
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      // Check if message contains email
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const emailMatch = userMessage.match(emailRegex);

      if (emailMatch && !hasProvidedEmail) {
        const email = emailMatch[0];
        await captureAILead({ email, sessionId });
        localStorage.setItem('t21_chat_email', email);
        setHasProvidedEmail(true);
        setShowEmailPrompt(false);
      }

      // Send to AI
      const response = await sendMessage({
        sessionId,
        message: userMessage,
        conversationHistory: messages.map(({ role, content }) => ({
          role,
          content,
        })),
      });

      // Add AI response to UI
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      // Show error message
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm having trouble responding right now. Please try again in a moment.",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmailSubmit = async (email: string) => {
    if (!email.trim()) return;

    try {
      await captureAILead({ email, sessionId });
      localStorage.setItem('t21_chat_email', email);
      setHasProvidedEmail(true);
      setShowEmailPrompt(false);

      // Add confirmation message
      const confirmMessage: Message = {
        role: 'assistant',
        content: "Thanks for sharing your email! I'll continue helping you learn more about attachment healing.",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, confirmMessage]);
    } catch (error) {
      console.error('Email capture error:', error);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-[var(--matcha)] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
          aria-label="Open chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-4 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[600px] bg-[#1a1a1a] rounded-2xl shadow-2xl flex flex-col z-50 border border-[#333]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#333] bg-gradient-to-r from-[var(--matcha)] to-[var(--matcha-dark)] rounded-t-2xl">
            <div className="flex items-center gap-3">
              <img
                src="/brand-logo.png"
                alt="T21"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-white">T21 Assistant</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1a1a1a]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-[var(--matcha)] text-white'
                      : 'bg-[#2a2a2a] text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Email Prompt */}
            {showEmailPrompt && !hasProvidedEmail && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-[#2a2a2a] border border-[var(--matcha)]">
                  <p className="text-sm text-white mb-2">
                    Want me to send you helpful resources? Share your email:
                  </p>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 rounded-lg border border-[#444] bg-[#1a1a1a] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--matcha)]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleEmailSubmit(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#2a2a2a] rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#333] bg-[#1a1a1a] rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 rounded-full border border-[#444] bg-[#2a2a2a] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--matcha)]"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="w-10 h-10 bg-[var(--matcha)] text-white rounded-full flex items-center justify-center hover:bg-[var(--matcha-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
