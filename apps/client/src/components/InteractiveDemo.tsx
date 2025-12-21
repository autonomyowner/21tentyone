'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

interface Message {
  type: 'user' | 'ai';
  textKey: 'userMsg1' | 'aiMsg1' | 'userMsg2' | 'aiMsg2' | 'userMsg3';
  delay: number;
}

const demoMessages: Message[] = [
  { type: 'user', textKey: 'userMsg1', delay: 0 },
  { type: 'ai', textKey: 'aiMsg1', delay: 2500 },
  { type: 'user', textKey: 'userMsg2', delay: 5500 },
  { type: 'ai', textKey: 'aiMsg2', delay: 8500 },
  { type: 'user', textKey: 'userMsg3', delay: 12000 },
];

export default function InteractiveDemo() {
  const { t } = useLanguage();
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [typingMessage, setTypingMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(-1);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsProgress, setAnalyticsProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const biases = [
    { name: t.demo.negativityBias, percentage: 78 },
    { name: t.demo.imposterSyndrome, percentage: 85 },
    { name: t.demo.lossAversion, percentage: 62 },
  ];

  // Intersection observer to start animation when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setIsInView(true);
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  // Main animation sequence
  useEffect(() => {
    if (!isInView) return;

    const showNextMessage = (index: number) => {
      if (index >= demoMessages.length) {
        setTimeout(() => {
          setShowAnalytics(true);
          animateAnalytics();
        }, 1500);
        return;
      }

      const message = demoMessages[index];
      const messageText = t.demo[message.textKey];
      setCurrentTypingIndex(index);
      setIsTyping(true);
      setTypingMessage('');

      let charIndex = 0;
      const typingInterval = setInterval(() => {
        if (charIndex <= messageText.length) {
          setTypingMessage(messageText.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setVisibleMessages(index + 1);
          setCurrentTypingIndex(-1);

          const nextDelay = index + 1 < demoMessages.length
            ? demoMessages[index + 1].delay - message.delay - (messageText.length * 30) - 500
            : 0;

          setTimeout(() => showNextMessage(index + 1), Math.max(nextDelay, 800));
        }
      }, 30);
    };

    const startTimeout = setTimeout(() => showNextMessage(0), 1000);
    return () => clearTimeout(startTimeout);
  }, [isInView, t.demo]);

  const animateAnalytics = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setAnalyticsProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 30);
  };

  const resetDemo = () => {
    setVisibleMessages(0);
    setTypingMessage('');
    setIsTyping(false);
    setCurrentTypingIndex(-1);
    setShowAnalytics(false);
    setAnalyticsProgress(0);
    setHasStarted(false);
    setTimeout(() => {
      setIsInView(true);
      setHasStarted(true);
    }, 100);
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden" ref={containerRef}>
      {/* Atmospheric background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, #C0C2D3 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #9FB3C8 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Editorial Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-3 mb-6"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              className="h-px w-12"
              style={{ background: 'linear-gradient(90deg, transparent, #9FB3C8)' }}
            />
            <span
              className="text-xs font-semibold tracking-[0.3em] uppercase"
              style={{ color: '#2E1020' }}
            >
              {t.demo.badge}
            </span>
            <div
              className="h-px w-12"
              style={{ background: 'linear-gradient(90deg, #9FB3C8, transparent)' }}
            />
          </div>

          <h2
            className="mb-6"
            style={{
              fontFamily: 'var(--font-poppins), var(--font-cairo), system-ui, sans-serif', fontWeight: 700,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
            }}
          >
            {t.demo.title}
          </h2>

          <p
            className="max-w-xl mx-auto text-lg"
            style={{
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            {t.demo.description}
          </p>
        </div>

        {/* Main Demo Container - Asymmetric Editorial Layout */}
        <div
          className="relative"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        >
          {/* Decorative frame */}
          <div
            className="absolute -inset-4 rounded-[2rem]"
            style={{
              background: 'linear-gradient(135deg, #C0C2D3 0%, transparent 50%, #9FB3C8 100%)',
              opacity: 0.5,
            }}
          />

          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-soft)',
              boxShadow: '0 40px 100px -20px rgba(46, 16, 32, 0.2), 0 0 0 1px rgba(255,255,255,0.5) inset',
            }}
          >
            {/* Top bar with replay */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{
                borderBottom: '1px solid var(--border-soft)',
                background: 'linear-gradient(180deg, var(--cream-50) 0%, var(--bg-card) 100%)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: '#2E1020',
                    boxShadow: '0 4px 12px rgba(46, 16, 32, 0.3)',
                  }}
                >
                  <span className="text-white font-bold text-sm">21</span>
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {t.demo.sessionTitle}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {t.demo.aiName}
                  </p>
                </div>
              </div>

              <button
                onClick={resetDemo}
                className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
                style={{
                  background: 'var(--cream-100)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform duration-500 group-hover:rotate-[-360deg]"
                  style={{ color: 'var(--brand-500)' }}
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {t.demo.replay}
                </span>
              </button>
            </div>

            {/* Main content grid */}
            <div className="grid lg:grid-cols-2">
              {/* Conversation Column */}
              <div
                className="p-6 flex flex-col"
                style={{ borderRight: '1px solid var(--border-soft)' }}
              >
                {/* AI Greeting */}
                <div className="mb-4 flex gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold"
                    style={{ background: 'var(--brand-100)', color: 'var(--brand-600)' }}
                  >
                    21
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-tl-md"
                    style={{
                      background: 'var(--cream-50)',
                      border: '1px solid var(--border-soft)',
                    }}
                  >
                    <p className="text-sm" style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>
                      {t.demo.aiGreeting}
                    </p>
                  </div>
                </div>

                {/* Conversation flow - Editorial style */}
                <div className="flex-1 space-y-4 overflow-y-auto pr-2 h-[320px]">
                  {demoMessages.slice(0, visibleMessages).map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 animate-fade-in ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold"
                        style={{
                          background: message.type === 'user' ? 'var(--terra-300)' : 'var(--brand-100)',
                          color: message.type === 'user' ? 'var(--terra-600)' : 'var(--brand-600)',
                        }}
                      >
                        {message.type === 'user' ? 'U' : '21'}
                      </div>
                      <div
                        className={`px-4 py-3 rounded-2xl max-w-[80%] ${message.type === 'user' ? 'rounded-tr-md' : 'rounded-tl-md'}`}
                        style={{
                          background: message.type === 'user'
                            ? '#2E1020'
                            : 'var(--cream-50)',
                          border: message.type === 'user' ? 'none' : '1px solid var(--border-soft)',
                          boxShadow: message.type === 'user' ? '0 4px 12px -4px rgba(46, 16, 32, 0.3)' : 'none',
                        }}
                      >
                        <p
                          className="text-sm"
                          style={{
                            color: message.type === 'user' ? 'white' : 'var(--text-primary)',
                            lineHeight: 1.6,
                          }}
                        >
                          {t.demo[message.textKey]}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && currentTypingIndex >= 0 && (
                    <div className={`flex gap-3 ${demoMessages[currentTypingIndex].type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div
                        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold"
                        style={{
                          background: demoMessages[currentTypingIndex].type === 'user' ? 'var(--terra-300)' : 'var(--brand-100)',
                          color: demoMessages[currentTypingIndex].type === 'user' ? 'var(--terra-600)' : 'var(--brand-600)',
                        }}
                      >
                        {demoMessages[currentTypingIndex].type === 'user' ? 'U' : '21'}
                      </div>
                      <div
                        className={`px-4 py-3 rounded-2xl max-w-[80%] ${demoMessages[currentTypingIndex].type === 'user' ? 'rounded-tr-md' : 'rounded-tl-md'}`}
                        style={{
                          background: demoMessages[currentTypingIndex].type === 'user'
                            ? '#2E1020'
                            : 'var(--cream-50)',
                          border: demoMessages[currentTypingIndex].type === 'user' ? 'none' : '1px solid var(--border-soft)',
                          boxShadow: demoMessages[currentTypingIndex].type === 'user' ? '0 4px 12px -4px rgba(46, 16, 32, 0.3)' : 'none',
                        }}
                      >
                        <p
                          className="text-sm"
                          style={{
                            color: demoMessages[currentTypingIndex].type === 'user' ? 'white' : 'var(--text-primary)',
                            lineHeight: 1.6,
                          }}
                        >
                          {typingMessage}
                          <span
                            className="inline-block w-0.5 h-4 ml-0.5 animate-pulse"
                            style={{
                              background: demoMessages[currentTypingIndex].type === 'user' ? 'white' : 'var(--brand-500)',
                              verticalAlign: 'text-bottom',
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input mock */}
                <div
                  className="mt-4 px-4 py-3 rounded-xl flex items-center gap-3"
                  style={{
                    background: 'var(--cream-50)',
                    border: '1px solid var(--border-soft)',
                  }}
                >
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {t.demo.placeholder}
                  </span>
                </div>
              </div>

              {/* Analytics Column */}
              <div
                className="p-6 flex flex-col"
                style={{
                  background: 'linear-gradient(180deg, var(--cream-50) 0%, var(--bg-card) 100%)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
                    {t.demo.analysisTitle}
                  </h3>
                  {showAnalytics && analyticsProgress >= 100 && (
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'var(--brand-100)', color: 'var(--brand-700)' }}
                    >
                      {t.demo.analysisComplete}
                    </span>
                  )}
                </div>

                {!showAnalytics ? (
                  /* Waiting state */
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ background: 'var(--brand-100)' }}
                    >
                      <div
                        className="w-8 h-8 rounded-full animate-pulse"
                        style={{ background: 'var(--brand-300)' }}
                      />
                    </div>
                    <p className="text-sm text-center mb-1" style={{ color: 'var(--text-secondary)' }}>
                      {t.demo.analyzing}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {t.demo.insightsAppear}
                    </p>
                  </div>
                ) : (
                  /* Analytics revealed - Layered cards */
                  <div className="space-y-3 flex flex-col flex-1">
                    {/* Primary Insight Card */}
                    <div
                      className="relative overflow-hidden rounded-xl p-4 transition-all duration-500"
                      style={{
                        background: '#2E1020',
                        boxShadow: '0 8px 24px -8px rgba(46, 16, 32, 0.4)',
                        opacity: analyticsProgress > 30 ? 1 : 0,
                        transform: analyticsProgress > 30 ? 'translateY(0)' : 'translateY(10px)',
                      }}
                    >
                      <p className="text-xs font-medium mb-1 opacity-70 text-white">
                        {t.demo.emotionalState}
                      </p>
                      <p
                        className="text-lg font-semibold text-white"
                        style={{ fontFamily: 'var(--font-poppins), var(--font-cairo), system-ui, sans-serif', fontWeight: 700 }}
                      >
                        {t.demo.performanceAnxiety}
                      </p>
                    </div>

                    {/* Secondary Insight */}
                    <div
                      className="rounded-xl p-4 transition-all duration-500"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-soft)',
                        opacity: analyticsProgress > 50 ? 1 : 0,
                        transform: analyticsProgress > 50 ? 'translateY(0)' : 'translateY(10px)',
                      }}
                    >
                      <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                        {t.demo.thinkingPattern}
                      </p>
                      <p
                        className="text-base font-semibold"
                        style={{ color: 'var(--brand-600)', fontFamily: 'var(--font-poppins), var(--font-cairo), system-ui, sans-serif', fontWeight: 700 }}
                      >
                        {t.demo.paralyzingPerfectionism}
                      </p>
                    </div>

                    {/* Pattern Bars */}
                    <div
                      className="rounded-xl p-4 transition-all duration-500"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-soft)',
                        opacity: analyticsProgress > 70 ? 1 : 0,
                        transform: analyticsProgress > 70 ? 'translateY(0)' : 'translateY(10px)',
                      }}
                    >
                      <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
                        {t.demo.biasesIdentified}
                      </p>
                      <div className="space-y-2">
                        {biases.map((bias, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                {bias.name}
                              </span>
                              <span className="text-sm font-medium" style={{ color: 'var(--brand-500)' }}>
                                {Math.round((analyticsProgress / 100) * bias.percentage)}%
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--cream-200)' }}>
                              <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{
                                  width: `${(analyticsProgress / 100) * bias.percentage}%`,
                                  background: index === 0 ? '#C0C2D3' : index === 1 ? '#2E1020' : '#9FB3C8',
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Insight */}
                    <div
                      className="rounded-xl p-4 transition-all duration-500 flex-1 flex flex-col justify-center"
                      style={{
                        background: 'linear-gradient(135deg, var(--cream-100) 0%, var(--brand-50) 100%)',
                        borderLeft: '3px solid var(--brand-500)',
                        opacity: analyticsProgress > 90 ? 1 : 0,
                        transform: analyticsProgress > 90 ? 'translateY(0)' : 'translateY(10px)',
                      }}
                    >
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--brand-600)' }}>
                        {t.demo.keyInsight}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                        {t.demo.insightText}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            {t.demo.readyDiscover}
          </p>
          <Link
            href="/signup"
            className="matcha-btn matcha-btn-primary text-base px-8 py-4 inline-block"
          >
            {t.demo.startFreeAnalysis}
          </Link>
        </div>
      </div>
    </section>
  );
}
