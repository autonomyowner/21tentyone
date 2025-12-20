'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AppDownloadPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated Background */}
      <div className="gradient-canvas">
        <div className="gradient-mesh"></div>
        <div className="aurora-layer aurora-1"></div>
        <div className="aurora-layer aurora-2"></div>
        <div className="morph-blob morph-blob-1"></div>
        <div className="morph-blob morph-blob-2"></div>
        <div className="grain-overlay"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                background: 'var(--brand-100)',
                color: 'var(--brand-700)',
                border: '1px solid var(--brand-200)',
              }}
            >
              Mobile App
            </span>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl mb-6"
              style={{
                fontFamily: 'var(--font-dm-serif), Georgia, serif',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            >
              Your Healing Journey,
              <br />
              <span className="text-gradient">Always With You</span>
            </h1>
            <p
              className="text-lg md:text-xl max-w-2xl mx-auto"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
            >
              Download the Brand 21Day app for iOS and Android.
              Access your personalized therapy sessions anytime, anywhere.
            </p>
          </div>

          {/* Main Download Section */}
          <div className={`transition-all duration-700 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div
              className="rounded-3xl p-8 md:p-12 lg:p-16"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,245,247,0.95) 100%)',
                border: '1px solid var(--border-soft)',
                boxShadow: 'var(--shadow-xl)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                {/* Phone Mockup */}
                <div className="relative order-2 lg:order-1 flex justify-center">
                  <div
                    className="relative"
                    style={{
                      perspective: '1000px',
                    }}
                  >
                    {/* Phone Frame */}
                    <div
                      className="relative w-[280px] h-[580px] rounded-[3rem] p-3"
                      style={{
                        background: 'linear-gradient(145deg, #1a1a1f 0%, #2E1020 50%, #1a1a1f 100%)',
                        boxShadow: `
                          0 50px 100px -20px rgba(46, 16, 32, 0.5),
                          0 30px 60px -30px rgba(46, 16, 32, 0.4),
                          inset 0 1px 0 rgba(255,255,255,0.1)
                        `,
                        transform: 'rotateY(-5deg) rotateX(2deg)',
                      }}
                    >
                      {/* Screen */}
                      <div
                        className="w-full h-full rounded-[2.5rem] overflow-hidden relative"
                        style={{
                          background: 'linear-gradient(180deg, var(--brand-50) 0%, #FFFFFF 30%, var(--brand-100) 100%)',
                        }}
                      >
                        {/* Status Bar */}
                        <div
                          className="flex justify-between items-center px-6 py-3"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          <span className="text-xs font-medium">9:41</span>
                          <div className="flex gap-1 items-center">
                            <div className="w-4 h-2 rounded-sm" style={{ background: 'var(--text-primary)' }}></div>
                          </div>
                        </div>

                        {/* App Content Preview */}
                        <div className="px-5 pt-4">
                          {/* Logo */}
                          <div className="text-center mb-6">
                            <div
                              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3"
                              style={{
                                background: 'linear-gradient(135deg, var(--brand-500) 0%, var(--brand-700) 100%)',
                                boxShadow: '0 8px 24px rgba(46, 16, 32, 0.3)',
                              }}
                            >
                              <span className="text-2xl font-bold text-white">21</span>
                            </div>
                            <h3
                              className="text-lg font-semibold"
                              style={{
                                fontFamily: 'var(--font-dm-serif), Georgia, serif',
                                color: 'var(--text-primary)'
                              }}
                            >
                              Brand 21Day
                            </h3>
                          </div>

                          {/* Feature Cards */}
                          <div className="space-y-3">
                            {[
                              { label: 'Daily Session', time: '15 min', color: 'var(--brand-400)' },
                              { label: 'Breathing', time: '5 min', color: 'var(--terra-400)' },
                              { label: 'Flash Technique', time: '10 min', color: 'var(--brand-600)' },
                            ].map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-3 rounded-xl"
                                style={{
                                  background: 'rgba(255,255,255,0.8)',
                                  border: '1px solid var(--border-soft)',
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-10 h-10 rounded-lg"
                                    style={{ background: item.color, opacity: 0.2 }}
                                  ></div>
                                  <span
                                    className="text-sm font-medium"
                                    style={{ color: 'var(--text-primary)' }}
                                  >
                                    {item.label}
                                  </span>
                                </div>
                                <span
                                  className="text-xs"
                                  style={{ color: 'var(--text-muted)' }}
                                >
                                  {item.time}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Progress */}
                          <div
                            className="mt-6 p-4 rounded-xl"
                            style={{
                              background: 'linear-gradient(135deg, var(--brand-100) 0%, var(--cream-200) 100%)',
                            }}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span
                                className="text-xs font-medium"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                Day 7 of 21
                              </span>
                              <span
                                className="text-xs font-semibold"
                                style={{ color: 'var(--brand-600)' }}
                              >
                                33%
                              </span>
                            </div>
                            <div
                              className="h-2 rounded-full overflow-hidden"
                              style={{ background: 'rgba(46, 16, 32, 0.1)' }}
                            >
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: '33%',
                                  background: 'linear-gradient(90deg, var(--brand-500) 0%, var(--brand-400) 100%)',
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Nav */}
                        <div
                          className="absolute bottom-0 left-0 right-0 flex justify-around items-center py-4 px-6"
                          style={{
                            background: 'rgba(255,255,255,0.9)',
                            borderTop: '1px solid var(--border-soft)',
                          }}
                        >
                          {[1, 2, 3, 4].map((_, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-lg"
                              style={{
                                background: i === 0 ? 'var(--brand-500)' : 'var(--cream-300)',
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>

                      {/* Notch */}
                      <div
                        className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 rounded-full"
                        style={{ background: '#000' }}
                      ></div>
                    </div>

                    {/* Floating Elements */}
                    <div
                      className="absolute -top-4 -right-8 px-4 py-2 rounded-xl"
                      style={{
                        background: 'white',
                        boxShadow: 'var(--shadow-lg)',
                        animation: 'float 4s ease-in-out infinite',
                      }}
                    >
                      <span className="text-sm font-medium" style={{ color: 'var(--brand-600)' }}>
                        New Session
                      </span>
                    </div>
                    <div
                      className="absolute bottom-20 -left-12 px-4 py-2 rounded-xl"
                      style={{
                        background: 'white',
                        boxShadow: 'var(--shadow-lg)',
                        animation: 'float 5s ease-in-out infinite 1s',
                      }}
                    >
                      <span className="text-sm font-medium" style={{ color: 'var(--terra-500)' }}>
                        Progress Saved
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Codes & Store Links */}
                <div className="order-1 lg:order-2 space-y-10">
                  <div>
                    <h2
                      className="text-2xl md:text-3xl mb-4"
                      style={{
                        fontFamily: 'var(--font-dm-serif), Georgia, serif',
                        color: 'var(--text-primary)',
                      }}
                    >
                      Scan to Download
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      Point your phone camera at the QR code to download the app directly,
                      or click the store buttons below.
                    </p>
                  </div>

                  {/* QR Code Cards */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* iOS QR */}
                    <div
                      className="group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        background: 'linear-gradient(135deg, #FFFFFF 0%, var(--cream-100) 100%)',
                        border: '2px solid var(--border-soft)',
                        boxShadow: 'var(--shadow-md)',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {/* Apple Logo */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: 'var(--text-primary)' }}
                        >
                          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Download on the</p>
                          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>App Store</p>
                        </div>
                      </div>

                      {/* QR Code Placeholder - Replace src with real QR code image */}
                      <div
                        className="aspect-square rounded-xl flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: 'white',
                          border: '1px solid var(--border-soft)',
                        }}
                      >
                        {/* Mock QR Pattern - iOS */}
                        <div className="absolute inset-4 grid grid-cols-9 gap-0.5">
                          {/* Deterministic QR-like pattern for iOS */}
                          {[
                            1,1,1,1,1,1,1,0,1,
                            1,0,0,0,0,0,1,0,0,
                            1,0,1,1,1,0,1,0,1,
                            1,0,1,1,1,0,1,0,0,
                            1,0,1,1,1,0,1,0,1,
                            1,0,0,0,0,0,1,0,1,
                            1,1,1,1,1,1,1,0,1,
                            0,0,0,0,0,0,0,0,0,
                            1,0,1,1,0,1,1,0,1,
                          ].map((filled, i) => (
                            <div
                              key={i}
                              className="rounded-[1px]"
                              style={{
                                background: filled ? 'var(--text-primary)' : 'transparent',
                              }}
                            ></div>
                          ))}
                        </div>
                        {/* Center Logo */}
                        <div
                          className="absolute w-12 h-12 rounded-lg flex items-center justify-center z-10"
                          style={{
                            background: 'white',
                            border: '2px solid var(--brand-200)',
                          }}
                        >
                          <span
                            className="text-lg font-bold"
                            style={{ color: 'var(--brand-600)' }}
                          >
                            21
                          </span>
                        </div>
                        {/* Placeholder overlay text */}
                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                          style={{ background: 'rgba(255,255,255,0.9)' }}
                        >
                          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                            QR Coming Soon
                          </span>
                        </div>
                      </div>

                      <p
                        className="text-center text-xs mt-3"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Requires iOS 15.0 or later
                      </p>
                    </div>

                    {/* Android QR */}
                    <div
                      className="group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        background: 'linear-gradient(135deg, #FFFFFF 0%, var(--cream-100) 100%)',
                        border: '2px solid var(--border-soft)',
                        boxShadow: 'var(--shadow-md)',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {/* Play Store Logo */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #00C853 0%, #00E676 100%)',
                          }}
                        >
                          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Get it on</p>
                          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Google Play</p>
                        </div>
                      </div>

                      {/* QR Code Placeholder - Replace src with real QR code image */}
                      <div
                        className="aspect-square rounded-xl flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: 'white',
                          border: '1px solid var(--border-soft)',
                        }}
                      >
                        {/* Mock QR Pattern - Android */}
                        <div className="absolute inset-4 grid grid-cols-9 gap-0.5">
                          {/* Deterministic QR-like pattern for Android */}
                          {[
                            1,1,1,1,1,1,1,0,0,
                            1,0,0,0,0,0,1,0,1,
                            1,0,1,1,1,0,1,0,1,
                            1,0,1,1,1,0,1,0,1,
                            1,0,1,1,1,0,1,0,0,
                            1,0,0,0,0,0,1,0,1,
                            1,1,1,1,1,1,1,0,0,
                            0,0,0,0,0,0,0,0,1,
                            0,1,1,0,1,0,1,0,1,
                          ].map((filled, i) => (
                            <div
                              key={i}
                              className="rounded-[1px]"
                              style={{
                                background: filled ? 'var(--text-primary)' : 'transparent',
                              }}
                            ></div>
                          ))}
                        </div>
                        {/* Center Logo */}
                        <div
                          className="absolute w-12 h-12 rounded-lg flex items-center justify-center z-10"
                          style={{
                            background: 'white',
                            border: '2px solid var(--brand-200)',
                          }}
                        >
                          <span
                            className="text-lg font-bold"
                            style={{ color: 'var(--brand-600)' }}
                          >
                            21
                          </span>
                        </div>
                        {/* Placeholder overlay text */}
                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                          style={{ background: 'rgba(255,255,255,0.9)' }}
                        >
                          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                            QR Coming Soon
                          </span>
                        </div>
                      </div>

                      <p
                        className="text-center text-xs mt-3"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Requires Android 8.0 or later
                      </p>
                    </div>
                  </div>

                  {/* Store Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* App Store Button */}
                    <a
                      href="#"
                      className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        background: 'var(--text-primary)',
                        boxShadow: '0 4px 14px rgba(46, 16, 32, 0.35)',
                      }}
                    >
                      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      <div className="text-left">
                        <p className="text-xs text-white/70">Download on the</p>
                        <p className="text-lg font-semibold text-white">App Store</p>
                      </div>
                    </a>

                    {/* Google Play Button */}
                    <a
                      href="#"
                      className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        background: 'linear-gradient(135deg, var(--brand-600) 0%, var(--brand-800) 100%)',
                        boxShadow: '0 4px 14px rgba(46, 16, 32, 0.35)',
                      }}
                    >
                      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                      <div className="text-left">
                        <p className="text-xs text-white/70">Get it on</p>
                        <p className="text-lg font-semibold text-white">Google Play</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className={`mt-20 transition-all duration-700 delay-400 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2
              className="text-center text-2xl md:text-3xl mb-12"
              style={{
                fontFamily: 'var(--font-dm-serif), Georgia, serif',
                color: 'var(--text-primary)',
              }}
            >
              Everything You Need, On The Go
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Offline Access',
                  description: 'Download sessions and practice without internet connection',
                  gradient: 'linear-gradient(135deg, var(--brand-100) 0%, var(--cream-200) 100%)',
                },
                {
                  title: 'Daily Reminders',
                  description: 'Gentle notifications to keep you on track with your healing journey',
                  gradient: 'linear-gradient(135deg, var(--terra-300) 0%, var(--cream-300) 100%)',
                },
                {
                  title: 'Progress Sync',
                  description: 'Your progress syncs across all devices automatically',
                  gradient: 'linear-gradient(135deg, var(--cream-200) 0%, var(--brand-100) 100%)',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: feature.gradient,
                    border: '1px solid var(--border-soft)',
                  }}
                >
                  <h3
                    className="text-xl mb-3"
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
              ))}
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-16">
            <Link
              href="/"
              className="matcha-link text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* CSS for QR placeholder animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
