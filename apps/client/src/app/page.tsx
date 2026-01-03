'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense, lazy } from 'react';

// Lazy load heavy components
const CountdownTimer = lazy(() => import('@/components/landing/CountdownTimer'));
const HeroDecorations = lazy(() => import('@/components/landing/HeroDecorations'));
const LazySections = lazy(() => import('@/components/landing/LazySections'));

// Loading skeleton for countdown
function CountdownSkeleton() {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-6 animate-pulse">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="text-center">
          <div className="h-12 w-16 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-12 bg-gray-200 rounded mx-auto" />
        </div>
      ))}
    </div>
  );
}

// Loading skeleton for sections
function SectionsSkeleton() {
  return (
    <div className="py-24 px-6 animate-pulse">
      <div className="max-w-5xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4" />
        <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto" />
      </div>
    </div>
  );
}

// CSS Variables and animations (inline styles to avoid render-blocking)
const landingStyles = `
  :root {
    --navy: #81352E;
    --blue: #9D433A;
    --gold: #BA5448;
    --cream: #FBE9E7;
    --amber: #C1918C;
    --light-blue: #E6C8C3;
    --white: #ffffff;
  }

  .landing-artistic {
    font-family: var(--font-outfit), 'Outfit', sans-serif;
    background: var(--cream);
  }

  .heading-serif {
    font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  }

  @keyframes morph {
    0%, 100% { d: path("M100 10 Q130 30 150 20 Q180 40 170 70 Q190 100 160 120 Q180 150 150 160 Q130 190 100 180 Q70 200 50 170 Q20 160 30 130 Q10 100 40 80 Q20 50 50 40 Q70 10 100 10 Z"); }
    50% { d: path("M100 20 Q140 25 155 30 Q175 50 165 80 Q185 110 155 130 Q175 155 145 165 Q120 185 95 175 Q60 195 45 165 Q15 150 25 120 Q5 90 35 70 Q25 45 55 35 Q80 15 100 20 Z"); }
  }

  .animate-morph path {
    animation: morph 8s ease-in-out infinite;
  }

  @keyframes pulse-slow {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }

  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }

  @keyframes float-gold {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-15px) rotate(2deg); }
    50% { transform: translateY(-8px) rotate(-1deg); }
    75% { transform: translateY(-20px) rotate(1deg); }
  }

  .animate-float-gold {
    animation: float-gold 8s ease-in-out infinite;
  }

  @keyframes reveal-up {
    from {
      opacity: 0;
      transform: translateY(60px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .reveal-up {
    animation: reveal-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes line-grow {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }

  .line-grow {
    animation: line-grow 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform-origin: left;
  }
`;

export default function LandingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: landingStyles }} />

      <div className="landing-artistic min-h-screen overflow-x-hidden">
        {/* Hero Section - Critical above-the-fold content */}
        <section
          className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
          style={{ background: 'var(--cream)' }}
        >
          {/* Decorations loaded dynamically */}
          <Suspense fallback={null}>
            <HeroDecorations />
          </Suspense>

          {/* Hero Content - Server rendered for fast FCP */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            {/* Special Offer Badge */}
            <div className="overflow-hidden reveal-up" style={{ animationDelay: '0.1s' }}>
              <span
                className="inline-block px-4 py-2 text-xs uppercase tracking-[0.3em] mb-6"
                style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 600 }}
              >
                Special Offer
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className="heading-serif text-4xl md:text-6xl lg:text-7xl font-light mb-6 reveal-up"
              style={{
                color: 'var(--navy)',
                animationDelay: '0.3s',
                lineHeight: 1.1
              }}
            >
              21-Day Attachment Reset
              <br />
              <span className="italic text-3xl md:text-5xl lg:text-6xl" style={{ color: 'var(--blue)' }}>
                Heal your patterns, calm your mind
              </span>
            </h1>

            {/* Decorative Line */}
            <div
              className="w-20 h-px mx-auto mb-6 line-grow"
              style={{ background: 'var(--gold)', animationDelay: '0.6s' }}
            />

            {/* Subheadline */}
            <p
              className="text-lg md:text-xl max-w-2xl mx-auto mb-8 reveal-up"
              style={{
                color: 'var(--navy)',
                opacity: 0.8,
                animationDelay: '0.5s',
                fontWeight: 400,
                lineHeight: 1.7
              }}
            >
              Stop chasing toxic love. Achieve emotional freedom in 21 days with a simple, daily attachment-healing system—<strong>without</strong> years of therapy, begging, or going "no contact" a hundred times.
            </p>

            {/* Countdown Timer - Client-side component */}
            <div
              className="mb-10 p-6 inline-block reveal-up"
              style={{
                background: 'var(--white)',
                boxShadow: '0 8px 40px rgba(129, 53, 46, 0.12)',
                animationDelay: '0.65s'
              }}
            >
              <p className="text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--gold)' }}>
                Limited-time launch pricing ends in:
              </p>
              <Suspense fallback={<CountdownSkeleton />}>
                <CountdownTimer />
              </Suspense>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 reveal-up"
              style={{ animationDelay: '0.7s' }}
            >
              <Link
                href="/the-twenty-one"
                className="group relative px-12 py-5 overflow-hidden transition-all duration-500"
                style={{ background: 'var(--navy)', color: 'var(--cream)' }}
              >
                <span className="relative z-10 text-sm uppercase tracking-[0.15em] font-semibold">
                  Get Instant Access – Only €27
                </span>
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-0 -translate-x-full"
                  style={{ background: 'var(--blue)' }}
                />
              </Link>

              <Link
                href="#how-it-works"
                className="text-sm uppercase tracking-[0.15em] font-medium flex items-center gap-3 group transition-all duration-300"
                style={{ color: 'var(--navy)' }}
              >
                Learn More
                <span
                  className="w-8 h-px transition-all duration-300 group-hover:w-12"
                  style={{ background: 'var(--gold)' }}
                />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div
              className="flex flex-wrap items-center justify-center gap-6 text-sm reveal-up"
              style={{ animationDelay: '0.8s', color: 'var(--navy)', opacity: 0.6 }}
            >
              <span>14-day money-back guarantee</span>
              <span style={{ color: 'var(--gold)' }}>•</span>
              <span>Secure checkout</span>
              <span style={{ color: 'var(--gold)' }}>•</span>
              <span>Instant access</span>
            </div>

            {/* Scroll Indicator */}
            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 reveal-up"
              style={{ animationDelay: '1.2s' }}
            >
              <span
                className="text-xs uppercase tracking-[0.3em]"
                style={{ color: 'var(--navy)', opacity: 0.5 }}
              >
                Explore
              </span>
              <div
                className="w-px h-12"
                style={{ background: 'linear-gradient(to bottom, var(--gold), transparent)' }}
              />
            </div>
          </div>
        </section>

        {/* Below-the-fold sections - Lazy loaded */}
        <Suspense fallback={<SectionsSkeleton />}>
          <LazySections />
        </Suspense>
      </div>
    </>
  );
}
