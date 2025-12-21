'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { useLanguage } from '@/components/LanguageProvider';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative" style={{ backgroundColor: '#fafafa' }}>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 z-10">
        <div className="max-w-5xl mx-auto">
          {/* Eyebrow */}
          <div
            className={`flex justify-center mb-8 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: 'var(--matcha-100)',
                color: 'var(--matcha-700)',
                border: '1px solid var(--matcha-200)',
              }}
            >
              {t.landing.eyebrow}
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className={`text-center mb-6 transition-all duration-700 delay-100 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{
              fontFamily: 'var(--font-dm-serif), Georgia, serif',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
            }}
          >
            {t.landing.headline}
            <br />
            <span className="text-gradient">{t.landing.headlineHighlight}</span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-center max-w-2xl mx-auto mb-10 text-lg transition-all duration-700 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
          >
            {t.landing.subheadline}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-700 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Link
              href="/assessment"
              className="matcha-btn matcha-btn-primary text-base px-8 py-4"
            >
              {t.landing.ctaAssessment || 'Take Free Assessment'}
            </Link>
            <Link
              href="#how-it-works"
              className="matcha-btn matcha-btn-secondary text-base px-8 py-4"
            >
              {t.landing.ctaHow}
            </Link>
          </div>

          {/* Assessment Highlight */}
          <div
            className={`max-w-2xl mx-auto mb-20 transition-all duration-700 delay-400 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Link
              href="/assessment"
              className="block p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] group"
              style={{
                background: 'linear-gradient(135deg, var(--brand-50) 0%, var(--cream-100) 100%)',
                border: '2px solid var(--brand-200)',
              }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, var(--brand-400), var(--brand-500))',
                  }}
                >
                  <span className="text-2xl text-white font-bold">?</span>
                </div>
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold mb-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t.landing.assessmentTitle || 'Discover Your Emotional Profile'}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {t.landing.assessmentDesc || 'Take our free 2-minute assessment and get personalized insights for your journey'}
                  </p>
                </div>
                <div
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all group-hover:translate-x-1"
                  style={{
                    background: '#2E1020',
                    color: '#FFFFFF',
                  }}
                >
                  {t.landing.assessmentCta || 'Start Now'}
                </div>
              </div>
            </Link>
          </div>

          {/* Hero Visual - Abstract Brain Pattern */}
          <div
            className={`relative max-w-3xl mx-auto transition-all duration-1000 delay-500 ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--cream-100) 0%, var(--cream-200) 100%)',
                border: '1px solid var(--border-soft)',
                boxShadow: 'var(--shadow-xl)',
                aspectRatio: '16/9',
              }}
            >
              {/* Abstract visualization representing mind analysis */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Central element */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #9FB3C8 0%, #2E1020 100%)',
                      boxShadow: '0 0 60px rgba(46, 16, 32, 0.4)',
                    }}
                  />
                  {/* Orbiting elements */}
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2"
                      style={{
                        width: `${180 + i * 60}px`,
                        height: `${180 + i * 60}px`,
                        marginLeft: `-${(180 + i * 60) / 2}px`,
                        marginTop: `-${(180 + i * 60) / 2}px`,
                        border: `1px solid rgba(46, 16, 32, ${0.3 - i * 0.04})`,
                        borderRadius: '50%',
                        animation: `spin ${20 + i * 5}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                      }}
                    >
                      <div
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          background: i % 2 === 0 ? '#2E1020' : '#9FB3C8',
                          top: '0',
                          left: '50%',
                          marginLeft: '-6px',
                          marginTop: '-6px',
                        }}
                      />
                    </div>
                  ))}
                  {/* Floating labels */}
                  <div
                    className="absolute top-1/4 left-1/4 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: '#FFFFFF',
                      color: '#2E1020',
                      boxShadow: 'var(--shadow-md)',
                      animation: 'float 4s ease-in-out infinite',
                    }}
                  >
                    {t.landing.cognitiveBiases}
                  </div>
                  <div
                    className="absolute top-1/3 right-1/4 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: '#FFFFFF',
                      color: '#2E1020',
                      boxShadow: 'var(--shadow-md)',
                      animation: 'float 5s ease-in-out infinite 1s',
                    }}
                  >
                    {t.landing.thoughtPatterns}
                  </div>
                  <div
                    className="absolute bottom-1/3 left-1/3 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: '#FFFFFF',
                      color: '#2E1020',
                      boxShadow: 'var(--shadow-md)',
                      animation: 'float 4.5s ease-in-out infinite 0.5s',
                    }}
                  >
                    {t.demo.analysisTitle}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 px-4 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{
                fontFamily: 'var(--font-dm-serif), Georgia, serif',
                color: 'var(--text-primary)',
              }}
            >
              {t.landing.howItWorks}
            </h2>
            <p
              className="max-w-xl mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t.landing.howItWorksDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: t.landing.step1Title,
                description: t.landing.step1Desc,
              },
              {
                step: '02',
                title: t.landing.step2Title,
                description: t.landing.step2Desc,
              },
              {
                step: '03',
                title: t.landing.step3Title,
                description: t.landing.step3Desc,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="matcha-card p-8 relative overflow-hidden group"
              >
                <span
                  className="absolute -top-4 -right-4 text-8xl font-bold opacity-5 group-hover:opacity-10 transition-opacity"
                  style={{
                    fontFamily: 'var(--font-dm-serif), Georgia, serif',
                    color: 'var(--matcha-600)',
                  }}
                >
                  {item.step}
                </span>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: 'var(--matcha-100)',
                    color: 'var(--matcha-700)',
                  }}
                >
                  <span
                    className="text-lg font-semibold"
                    style={{ fontFamily: 'var(--font-dm-serif), Georgia, serif' }}
                  >
                    {item.step}
                  </span>
                </div>
                <h3
                  className="text-xl mb-3"
                  style={{
                    fontFamily: 'var(--font-dm-serif), Georgia, serif',
                    color: 'var(--text-primary)',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <InteractiveDemo />

      {/* Features Section */}
      <section
        className="relative py-24 px-4 z-10"
        style={{ background: 'rgba(250, 245, 247, 0.9)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{
                fontFamily: 'var(--font-dm-serif), Georgia, serif',
                color: 'var(--text-primary)',
              }}
            >
              {t.landing.whatReveals}
            </h2>
            <p
              className="max-w-xl mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t.landing.whatRevealsDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: t.landing.cognitiveBiases,
                description: t.landing.cognitiveBiasesDesc,
                color: 'var(--matcha-500)',
              },
              {
                title: t.landing.thoughtPatterns,
                description: t.landing.thoughtPatternsDesc,
                color: 'var(--terra-400)',
              },
              {
                title: t.landing.emotionalBlockers,
                description: t.landing.emotionalBlockersDesc,
                color: 'var(--matcha-600)',
              },
              {
                title: t.landing.psychProfile,
                description: t.landing.psychProfileDesc,
                color: 'var(--terra-500)',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex gap-6 p-6 rounded-2xl transition-all duration-300 hover:bg-white/50"
              >
                <div
                  className="w-1 rounded-full flex-shrink-0"
                  style={{ background: feature.color }}
                />
                <div>
                  <h3
                    className="text-xl mb-2"
                    style={{
                      fontFamily: 'var(--font-dm-serif), Georgia, serif',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section
        className="relative py-24 px-4 z-10"
        style={{ background: 'rgba(250, 245, 247, 0.85)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl mb-4"
            style={{
              fontFamily: 'var(--font-dm-serif), Georgia, serif',
              color: 'var(--text-primary)',
            }}
          >
            {t.landing.startFree}
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            {t.landing.startFreeDesc}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="matcha-btn matcha-btn-primary text-base px-8 py-4"
            >
              {t.landing.createFreeAccount}
            </Link>
            <Link
              href="/pricing"
              className="matcha-btn matcha-btn-secondary text-base px-8 py-4"
            >
              {t.landing.seePricing}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 py-12"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, var(--brand-50) 100%)',
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <p
            className="text-4xl md:text-5xl font-semibold tracking-tight"
            style={{
              fontFamily: 'var(--font-dm-serif), Georgia, serif',
              background: 'linear-gradient(135deg, #2E1020 0%, #9FB3C8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            21|Twenty One®
          </p>
          <div
            className="mt-3 w-16 h-0.5 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #9FB3C8, transparent)',
            }}
          />
        </div>
      </footer>

    </div>
  );
}
