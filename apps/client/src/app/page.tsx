'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';

// Countdown Timer Component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 11,
    hours: 34,
    minutes: 12,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              days--;
              if (days < 0) {
                days = 0;
                hours = 0;
                minutes = 0;
                seconds = 0;
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 md:gap-6">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Minutes' },
        { value: timeLeft.seconds, label: 'Seconds' }
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div
            className="text-3xl md:text-5xl font-bold mb-1"
            style={{ color: 'var(--navy)', fontFamily: 'var(--font-poppins)' }}
          >
            {String(item.value).padStart(2, '0')}
          </div>
          <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--blue)', opacity: 0.7 }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({
  quote,
  author,
  delay = 0
}: {
  quote: string;
  author: string;
  delay?: number;
}) => (
  <div
    className="p-6 md:p-8 transition-all duration-500 hover:translate-y-[-4px]"
    style={{
      background: 'var(--white)',
      border: '1px solid rgba(26, 46, 74, 0.1)',
      animationDelay: `${delay}s`
    }}
  >
    <p
      className="text-lg leading-relaxed mb-6 italic"
      style={{ color: 'var(--navy)', opacity: 0.8 }}
    >
      "{quote}"
    </p>
    <div
      className="w-12 h-px mb-4"
      style={{ background: 'var(--gold)' }}
    />
    <p className="font-semibold" style={{ color: 'var(--navy)' }}>
      {author}
    </p>
  </div>
);

// Bonus Item Component
const BonusItem = ({
  number,
  title,
  description
}: {
  number: number;
  title: string;
  description: string;
}) => (
  <div className="flex gap-4 p-4" style={{ background: 'rgba(212, 160, 57, 0.08)' }}>
    <div
      className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-sm font-bold"
      style={{ background: 'var(--gold)', color: 'var(--navy)' }}
    >
      {number}
    </div>
    <div>
      <h4 className="font-semibold mb-1" style={{ color: 'var(--navy)' }}>{title}</h4>
      <p className="text-sm" style={{ color: 'var(--navy)', opacity: 0.7 }}>{description}</p>
    </div>
  </div>
);

// Paint Splatter SVG Component
const PaintSplatter = ({
  className,
  color,
  delay = 0,
  scale = 1
}: {
  className?: string;
  color: string;
  delay?: number;
  scale?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <svg
      className={`absolute transition-all duration-1000 ease-out pointer-events-none ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `scale(${isVisible ? scale : 0})`,
        filter: 'blur(0.5px)'
      }}
      viewBox="0 0 200 200"
      fill="none"
    >
      <path
        d="M100 10 Q130 30 150 20 Q180 40 170 70 Q190 100 160 120 Q180 150 150 160 Q130 190 100 180 Q70 200 50 170 Q20 160 30 130 Q10 100 40 80 Q20 50 50 40 Q70 10 100 10 Z"
        fill={color}
        className="animate-morph"
      />
      <circle cx="160" cy="35" r="8" fill={color} className="animate-pulse-slow" />
      <circle cx="180" cy="60" r="5" fill={color} style={{ animationDelay: '0.2s' }} />
      <circle cx="30" cy="150" r="6" fill={color} style={{ animationDelay: '0.4s' }} />
      <circle cx="170" cy="140" r="4" fill={color} style={{ animationDelay: '0.3s' }} />
    </svg>
  );
};

// Floating Gold Rectangle
const GoldRect = ({
  className,
  size = 'md',
  delay = 0
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
}) => {
  const sizes = {
    sm: 'w-6 h-10',
    md: 'w-10 h-16',
    lg: 'w-14 h-24'
  };

  return (
    <div
      className={`absolute ${sizes[size]} animate-float-gold pointer-events-none ${className}`}
      style={{
        background: 'linear-gradient(135deg, #d4a039 0%, #e8a54b 50%, #d4a039 100%)',
        animationDelay: `${delay}s`,
        boxShadow: '0 8px 32px rgba(212, 160, 57, 0.3)'
      }}
    />
  );
};

// Grain Overlay
const GrainOverlay = () => (
  <div
    className="fixed inset-0 pointer-events-none z-50 opacity-[0.06]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

// Feature Card Component
const FeatureCard = ({
  number,
  title,
  description,
  isLarge = false
}: {
  number: string;
  title: string;
  description: string;
  isLarge?: boolean;
}) => {
  return (
    <div
      className={`group relative p-8 md:p-10 transition-all duration-500 hover:translate-y-[-4px] ${
        isLarge ? 'md:col-span-2' : ''
      }`}
      style={{
        background: 'var(--navy)',
        minHeight: isLarge ? '350px' : '280px'
      }}
    >
      <span
        className={`heading-serif font-light absolute -top-4 -left-2 opacity-10 ${
          isLarge ? 'text-[140px]' : 'text-[100px]'
        }`}
        style={{ color: 'var(--light-blue)' }}
      >
        {number}
      </span>

      <div className="relative z-10 h-full flex flex-col justify-end">
        <h3
          className={`heading-serif font-light mb-4 ${isLarge ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}
          style={{ color: 'var(--cream)' }}
        >
          {title}
        </h3>
        <p
          className="text-base leading-relaxed"
          style={{ color: 'var(--cream)', opacity: 0.6 }}
        >
          {description}
        </p>

        <div
          className="w-12 h-px mt-6 transition-all duration-500 group-hover:w-24"
          style={{ background: 'var(--gold)' }}
        />
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Custom Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --navy: #1a2e4a;
          --blue: #2d5a8a;
          --gold: #d4a039;
          --cream: #f5f0e8;
          --amber: #e8a54b;
          --light-blue: #6b9cc4;
          --white: #ffffff;
        }

        .landing-artistic {
          font-family: 'Outfit', sans-serif;
          background: var(--cream);
        }

        .heading-serif {
          font-family: 'Cormorant Garamond', serif;
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

        @keyframes paint-expand {
          from {
            transform: scale(0) rotate(-10deg);
            opacity: 0;
          }
          to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .paint-expand {
          animation: paint-expand 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes line-grow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        .line-grow {
          animation: line-grow 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: left;
        }

        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-orbit {
          animation: orbit 20s linear infinite;
        }

        .animate-orbit-reverse {
          animation: orbit 25s linear infinite reverse;
        }
      `}</style>

      <div className="landing-artistic min-h-screen overflow-x-hidden">
        <GrainOverlay />

        {/* Custom Cursor */}
        <div
          className="fixed w-10 h-10 rounded-full pointer-events-none z-[100] hidden md:block mix-blend-difference"
          style={{
            left: mousePos.x - 20,
            top: mousePos.y - 20,
            border: '1px solid var(--gold)',
            transition: 'transform 0.1s ease-out',
          }}
        />
        <div
          className="fixed w-2 h-2 rounded-full pointer-events-none z-[100] hidden md:block"
          style={{
            left: mousePos.x - 4,
            top: mousePos.y - 4,
            background: 'var(--gold)',
          }}
        />

        {/* ==================== HERO SECTION ==================== */}
        <section
          className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
          style={{ background: 'var(--cream)' }}
        >
          {/* Animated Paint Splatters */}
          <PaintSplatter
            className="w-[500px] h-[500px] -top-20 -left-32 paint-expand"
            color="rgba(45, 90, 138, 0.12)"
            delay={300}
            scale={1}
          />
          <PaintSplatter
            className="w-[400px] h-[400px] -bottom-20 -right-16 paint-expand"
            color="rgba(26, 46, 74, 0.1)"
            delay={600}
            scale={0.9}
          />
          <PaintSplatter
            className="w-[300px] h-[300px] top-1/3 right-1/4 paint-expand"
            color="rgba(107, 156, 196, 0.08)"
            delay={900}
            scale={0.7}
          />

          {/* Floating Gold Rectangles */}
          <GoldRect className="top-[20%] left-[8%]" size="md" delay={0.5} />
          <GoldRect className="top-[30%] right-[12%]" size="lg" delay={1} />
          <GoldRect className="bottom-[25%] left-[15%]" size="sm" delay={1.5} />
          <GoldRect className="bottom-[35%] right-[20%]" size="md" delay={2} />

          {/* Hero Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            {/* Special Offer Badge */}
            <div
              className={`overflow-hidden ${mounted ? 'reveal-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.1s' }}
            >
              <span
                className="inline-block px-4 py-2 text-xs uppercase tracking-[0.3em] mb-6"
                style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 600 }}
              >
                Special Offer
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className={`heading-serif text-4xl md:text-6xl lg:text-7xl font-light mb-6 ${mounted ? 'reveal-up' : 'opacity-0'}`}
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
              className={`w-20 h-px mx-auto mb-6 ${mounted ? 'line-grow' : ''}`}
              style={{ background: 'var(--gold)', animationDelay: '0.6s' }}
            />

            {/* Subheadline */}
            <p
              className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 ${mounted ? 'reveal-up' : 'opacity-0'}`}
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

            {/* Countdown Timer */}
            <div
              className={`mb-10 p-6 inline-block ${mounted ? 'reveal-up' : 'opacity-0'}`}
              style={{
                background: 'var(--white)',
                boxShadow: '0 8px 40px rgba(26, 46, 74, 0.12)',
                animationDelay: '0.65s'
              }}
            >
              <p className="text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--gold)' }}>
                Limited-time launch pricing ends in:
              </p>
              <CountdownTimer />
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 ${mounted ? 'reveal-up' : 'opacity-0'}`}
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
              className={`flex flex-wrap items-center justify-center gap-6 text-sm ${mounted ? 'reveal-up' : 'opacity-0'}`}
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
              className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 ${mounted ? 'reveal-up' : 'opacity-0'}`}
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

        {/* ==================== INTRODUCING SECTION ==================== */}
        <section
          className="relative py-24 md:py-32 px-6"
          style={{ background: 'var(--white)' }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <span
                className="text-xs uppercase tracking-[0.4em] block mb-4"
                style={{ color: 'var(--gold)' }}
              >
                Introducing
              </span>
              <h2
                className="heading-serif text-4xl md:text-5xl lg:text-6xl font-light mb-6"
                style={{ color: 'var(--navy)', lineHeight: 1.1 }}
              >
                Twenty One
                <span className="italic block" style={{ color: 'var(--blue)' }}>
                  21-Day Attachment Reset
                </span>
              </h2>
              <div className="w-16 h-px mx-auto mb-8" style={{ background: 'var(--gold)' }} />
              <p
                className="text-lg max-w-3xl mx-auto leading-relaxed"
                style={{ color: 'var(--navy)', opacity: 0.7 }}
              >
                A guided 21-day program that helps you break toxic attachment, rebuild self-respect, and create the foundation for healthy love—through short daily lessons, simple exercises, and practical tools you can use in real life.
              </p>
            </div>

            {/* Outcomes Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                {
                  number: '01',
                  title: 'Stop Obsessing',
                  description: 'Stop obsessing over people who are wrong for you and finally break free from the mental loops.'
                },
                {
                  number: '02',
                  title: 'Feel Secure',
                  description: 'Feel calmer, more secure, and in control of your emotions instead of anxious and desperate.'
                },
                {
                  number: '03',
                  title: 'Set Boundaries',
                  description: 'Set healthy boundaries without guilt or panic—and actually stick to them.'
                }
              ].map((outcome, i) => (
                <div
                  key={i}
                  className="p-8 transition-all duration-500 hover:translate-y-[-4px]"
                  style={{
                    background: 'var(--cream)',
                    border: '1px solid rgba(26, 46, 74, 0.08)'
                  }}
                >
                  <span
                    className="text-5xl font-light opacity-15 block mb-4"
                    style={{ color: 'var(--navy)' }}
                  >
                    {outcome.number}
                  </span>
                  <h3
                    className="heading-serif text-xl font-semibold mb-3"
                    style={{ color: 'var(--navy)' }}
                  >
                    {outcome.title}
                  </h3>
                  <p style={{ color: 'var(--navy)', opacity: 0.7, lineHeight: 1.7 }}>
                    {outcome.description}
                  </p>
                </div>
              ))}
            </div>

            {/* What's Included */}
            <div
              className="p-8 md:p-12"
              style={{ background: 'var(--navy)' }}
            >
              <h3
                className="heading-serif text-2xl md:text-3xl font-light mb-8 text-center"
                style={{ color: 'var(--cream)' }}
              >
                What's Included
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: '21-Day Daily Plan', desc: 'One clear lesson and exercise each day—no overwhelm.' },
                  { title: '6 Focused Video Trainings', desc: 'Covering attachment, boundaries, and self-worth.' },
                  { title: '21-Day PDF Workbook', desc: 'Prompts, checklists, and trackers to guide your journey.' },
                  { title: 'Scripts & Message Templates', desc: 'What to say (and what not to send) in triggering moments.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div
                      className="flex-shrink-0 w-2 h-2 mt-2 rounded-full"
                      style={{ background: 'var(--gold)' }}
                    />
                    <div>
                      <h4 className="font-semibold mb-1" style={{ color: 'var(--cream)' }}>
                        {item.title}
                      </h4>
                      <p style={{ color: 'var(--cream)', opacity: 0.7 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p
                className="text-center mt-8 text-sm"
                style={{ color: 'var(--light-blue)' }}
              >
                The best way to stop chasing toxic relationships is to change your patterns from the inside out—one day at a time.
              </p>
            </div>
          </div>

          <GoldRect className="top-20 right-[5%] opacity-30" size="sm" delay={0} />
          <GoldRect className="bottom-32 left-[8%] opacity-25" size="md" delay={0.5} />
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section
          id="how-it-works"
          className="relative py-24 md:py-32 px-6"
          style={{ background: 'var(--navy)' }}
        >
          <GoldRect className="top-20 right-[8%] opacity-50" size="sm" delay={0} />
          <GoldRect className="bottom-32 left-[5%] opacity-40" size="md" delay={0.5} />

          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <span
                className="text-xs uppercase tracking-[0.4em] block mb-4"
                style={{ color: 'var(--gold)' }}
              >
                Your Journey
              </span>
              <h2
                className="heading-serif text-4xl md:text-5xl lg:text-6xl font-light"
                style={{ color: 'var(--cream)', lineHeight: 1.1 }}
              >
                With Twenty One,{' '}
                <span className="italic" style={{ color: 'var(--light-blue)' }}>
                  You Will...
                </span>
              </h2>
              <div className="w-16 h-px mx-auto mt-8" style={{ background: 'var(--gold)' }} />
            </div>

            {/* 4 Steps Grid */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {[
                {
                  number: '01',
                  title: 'Start the Reset',
                  description: 'Log in, download your workbook, and watch the quick orientation video.'
                },
                {
                  number: '02',
                  title: 'Follow One Lesson Per Day',
                  description: 'Spend 15–20 minutes a day on the lesson and exercise—no overwhelm.'
                },
                {
                  number: '03',
                  title: 'Use the Tools in Real Situations',
                  description: 'Apply scripts and calming tools when you feel triggered or want to reach out.'
                },
                {
                  number: '04',
                  title: 'Integrate and Move Forward',
                  description: "By day 21, you'll have a new baseline: clearer standards, stronger boundaries, and a calmer nervous system."
                }
              ].map((step, i) => (
                <FeatureCard
                  key={i}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </div>
          </div>

          {/* Paint Splatter */}
          <PaintSplatter
            className="w-[300px] h-[300px] -bottom-16 right-[15%] opacity-15"
            color="var(--light-blue)"
            delay={0}
            scale={0.6}
          />
        </section>

        {/* ==================== BONUS STACK ==================== */}
        <section
          className="relative py-24 md:py-32 px-6"
          style={{ background: 'var(--cream)' }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span
                className="text-xs uppercase tracking-[0.4em] block mb-4"
                style={{ color: 'var(--gold)' }}
              >
                Plus
              </span>
              <h2
                className="heading-serif text-3xl md:text-4xl lg:text-5xl font-light mb-6"
                style={{ color: 'var(--navy)', lineHeight: 1.1 }}
              >
                If You Join Now, You Also Get{' '}
                <span className="italic" style={{ color: 'var(--blue)' }}>
                  These Bonuses FREE
                </span>
              </h2>
              <div className="w-16 h-px mx-auto mb-6" style={{ background: 'var(--gold)' }} />
              <p
                className="text-lg max-w-3xl mx-auto leading-relaxed"
                style={{ color: 'var(--navy)', opacity: 0.7 }}
              >
                This isn't a generic info dump—it's a targeted, plug-and-play resource built for people who are tired of repeating the same relationship story.
              </p>
            </div>

            {/* Bonus Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              <BonusItem
                number={1}
                title="No-Contact Support Kit"
                description="Daily prompts and reminders to stay grounded during no-contact or low-contact."
              />
              <BonusItem
                number={2}
                title="Emergency Calm Audio"
                description="A short audio you can play when you feel the urge to text, beg, or chase."
              />
              <BonusItem
                number={3}
                title="Healthy Standards Checklist"
                description="A simple filter to evaluate future partners and protect yourself from repeating the past."
              />
              <BonusItem
                number={4}
                title="Post-Breakup Reset Plan"
                description="A 7-day plan to stabilise your emotions right after a breakup or relapse."
              />
            </div>

            <p
              className="text-center text-sm"
              style={{ color: 'var(--navy)', opacity: 0.6 }}
            >
              Whether you're still in the relationship or already out but still emotionally stuck, you'll get the tools and clarity you need to start seeing shifts right away.
            </p>
          </div>

          <GoldRect className="top-24 left-[5%] opacity-25" size="sm" delay={0} />
          <GoldRect className="bottom-20 right-[8%] opacity-30" size="md" delay={0.5} />
        </section>

        {/* ==================== OLD WAY VS NEW WAY ==================== */}
        <section
          className="relative py-24 md:py-32 px-6"
          style={{ background: 'var(--white)' }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <span
                className="text-xs uppercase tracking-[0.4em] block mb-4"
                style={{ color: 'var(--gold)' }}
              >
                The Truth
              </span>
              <h2
                className="heading-serif text-3xl md:text-4xl lg:text-5xl font-light mb-6"
                style={{ color: 'var(--navy)', lineHeight: 1.1 }}
              >
                The Old Way{' '}
                <span className="italic" style={{ color: 'var(--blue)' }}>
                  Is Broken
                </span>
              </h2>
              <div className="w-16 h-px mx-auto mb-6" style={{ background: 'var(--gold)' }} />
              <p
                className="text-lg max-w-3xl mx-auto leading-relaxed"
                style={{ color: 'var(--navy)', opacity: 0.7 }}
              >
                If you've been trying to heal by binge-watching breakup videos, stalking their socials, or forcing yourself into 'no contact' with zero internal work… It's no surprise it hasn't worked.
              </p>
            </div>

            {/* Comparison Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Old Way */}
              <div
                className="p-8"
                style={{ background: 'var(--cream)', border: '1px solid rgba(26, 46, 74, 0.1)' }}
              >
                <h3
                  className="text-lg font-semibold uppercase tracking-wider mb-6"
                  style={{ color: 'var(--navy)', opacity: 0.5 }}
                >
                  Old Way
                </h3>
                <ul className="space-y-4">
                  {[
                    'Relying on willpower to not text them.',
                    'Obsessively analysing every message and sign.',
                    'Piecing together random advice from TikTok and YouTube.'
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3" style={{ color: 'var(--navy)', opacity: 0.7 }}>
                      <span style={{ color: 'var(--navy)', opacity: 0.3 }}>✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* New Way */}
              <div
                className="p-8"
                style={{ background: 'var(--navy)' }}
              >
                <h3
                  className="text-lg font-semibold uppercase tracking-wider mb-6"
                  style={{ color: 'var(--gold)' }}
                >
                  New Way
                </h3>
                <ul className="space-y-4">
                  {[
                    'Following a structured 21-day process.',
                    'Doing one clear exercise per day to retrain your patterns.',
                    'Using proven scripts and tools when your emotions spike.'
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3" style={{ color: 'var(--cream)' }}>
                      <span style={{ color: 'var(--gold)' }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Benefits List */}
            <div className="mt-12 text-center">
              <p
                className="text-lg mb-6"
                style={{ color: 'var(--navy)' }}
              >
                With <strong>Twenty One</strong>, you'll be able to:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
                {[
                  'Skip trial and error and follow a proven path.',
                  'Build momentum fast without overwhelm or confusion.',
                  'Avoid the mistakes that keep most people stuck in toxic loops.',
                  'Get clear, actionable steps you can implement the same day.',
                  'Finally see real results from your efforts.',
                  'Feel calm and grounded instead of anxious.'
                ].map((benefit, i) => (
                  <div
                    key={i}
                    className="flex gap-2 items-start p-3"
                    style={{ background: 'rgba(212, 160, 57, 0.08)' }}
                  >
                    <span style={{ color: 'var(--gold)' }}>•</span>
                    <span style={{ color: 'var(--navy)', opacity: 0.8 }}>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== INSIDE THE PROGRAM ==================== */}
        <section
          className="relative py-24 md:py-32 px-6"
          style={{ background: 'linear-gradient(135deg, var(--blue) 0%, var(--navy) 100%)' }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <span
                className="text-xs uppercase tracking-[0.4em] block mb-4"
                style={{ color: 'var(--gold)' }}
              >
                Inside The Program
              </span>
              <h2
                className="heading-serif text-3xl md:text-4xl lg:text-5xl font-light mb-6"
                style={{ color: 'var(--cream)', lineHeight: 1.1 }}
              >
                Here's What You'll{' '}
                <span className="italic" style={{ color: 'var(--light-blue)' }}>
                  Find Inside
                </span>
              </h2>
              <div className="w-16 h-px mx-auto mb-6" style={{ background: 'var(--gold)' }} />
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ color: 'var(--cream)', opacity: 0.8 }}
              >
                In 21 days you'll move from obsession and anxiety to clarity, self-respect, and stronger boundaries—without playing games or turning cold.
              </p>
            </div>

            {/* 3 Weeks Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  week: 'Week 1',
                  title: 'Awareness & Patterns',
                  description: 'Understand your attachment style, triggers, and why you get hooked.'
                },
                {
                  week: 'Week 2',
                  title: 'Detachment & Emotional Regulation',
                  description: 'Tools to handle urges, anxiety, and overthinking in real time.'
                },
                {
                  week: 'Week 3',
                  title: 'Boundaries & Rebuilding',
                  description: 'Learn to say no, raise your standards, and prepare for healthier love.'
                }
              ].map((week, i) => (
                <div
                  key={i}
                  className="p-8 transition-all duration-500 hover:translate-y-[-4px]"
                  style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)' }}
                >
                  <span
                    className="text-xs uppercase tracking-wider block mb-3"
                    style={{ color: 'var(--gold)' }}
                  >
                    {week.week}
                  </span>
                  <h3
                    className="heading-serif text-xl font-semibold mb-3"
                    style={{ color: 'var(--cream)' }}
                  >
                    {week.title}
                  </h3>
                  <p style={{ color: 'var(--cream)', opacity: 0.7, lineHeight: 1.7 }}>
                    {week.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <PaintSplatter
            className="w-[300px] h-[300px] -bottom-16 left-[10%] opacity-10"
            color="var(--light-blue)"
            delay={0}
            scale={0.5}
          />
        </section>

        {/* ==================== TESTIMONIALS ==================== */}
        <section
          className="relative py-24 md:py-32 px-6"
          style={{ background: 'var(--cream)' }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span
                className="text-xs uppercase tracking-[0.4em] block mb-4"
                style={{ color: 'var(--gold)' }}
              >
                Real Results
              </span>
              <h2
                className="heading-serif text-3xl md:text-4xl lg:text-5xl font-light mb-6"
                style={{ color: 'var(--navy)', lineHeight: 1.1 }}
              >
                What Others Are{' '}
                <span className="italic" style={{ color: 'var(--blue)' }}>
                  Saying
                </span>
              </h2>
              <div className="w-16 h-px mx-auto" style={{ background: 'var(--gold)' }} />
            </div>

            {/* Testimonials Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <TestimonialCard
                quote="I was stuck in the same painful pattern for years, but after using Twenty One, everything clicked. It gave me the exact steps to detach emotionally."
                author="Sarah M."
                delay={0}
              />
              <TestimonialCard
                quote="The scripts alone were worth it. I finally knew what to say (and what NOT to say) when I felt triggered. Game changer."
                author="Jessica T."
                delay={0.1}
              />
              <TestimonialCard
                quote="I thought I needed years of therapy. Turns out I needed a simple daily system. By week 3, I felt like a different person."
                author="Amanda K."
                delay={0.2}
              />
            </div>

            {/* Featured Testimonial */}
            <div
              className="p-8 md:p-12 text-center"
              style={{ background: 'var(--navy)' }}
            >
              <p
                className="text-xl md:text-2xl leading-relaxed mb-6 italic"
                style={{ color: 'var(--cream)' }}
              >
                "I started feeling calmer and more in control within two weeks. Everything clicked."
              </p>
              <div className="w-12 h-px mx-auto mb-4" style={{ background: 'var(--gold)' }} />
              <p className="font-semibold" style={{ color: 'var(--light-blue)' }}>
                — Early Access Member
              </p>
            </div>
          </div>

          <GoldRect className="top-20 left-[5%] opacity-25" size="sm" delay={0} />
          <GoldRect className="bottom-24 right-[8%] opacity-30" size="md" delay={0.5} />
        </section>

        {/* ==================== IS THIS RIGHT FOR YOU ==================== */}
        <section
          className="relative py-24 md:py-32 px-6"
          style={{ background: 'var(--white)' }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span
                className="text-xs uppercase tracking-[0.4em] block mb-4"
                style={{ color: 'var(--gold)' }}
              >
                Is This For You?
              </span>
              <h2
                className="heading-serif text-3xl md:text-4xl lg:text-5xl font-light"
                style={{ color: 'var(--navy)', lineHeight: 1.1 }}
              >
                Who Is Twenty One{' '}
                <span className="italic" style={{ color: 'var(--blue)' }}>
                  For?
                </span>
              </h2>
              <div className="w-16 h-px mx-auto mt-6" style={{ background: 'var(--gold)' }} />
            </div>

            {/* Two Columns */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Perfect For */}
              <div className="p-8" style={{ background: 'rgba(212, 160, 57, 0.08)' }}>
                <h3
                  className="text-lg font-semibold uppercase tracking-wider mb-6"
                  style={{ color: 'var(--gold)' }}
                >
                  Perfect For You If:
                </h3>
                <ul className="space-y-4">
                  {[
                    "You're tired of repeating the same painful relationship patterns.",
                    "You're ready to be honest with yourself and do the work.",
                    "You can commit to 15–20 minutes per day for 21 days.",
                    "You want practical tools, not endless theory."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3" style={{ color: 'var(--navy)' }}>
                      <span style={{ color: 'var(--gold)' }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not For */}
              <div className="p-8" style={{ background: 'var(--cream)' }}>
                <h3
                  className="text-lg font-semibold uppercase tracking-wider mb-6"
                  style={{ color: 'var(--navy)', opacity: 0.5 }}
                >
                  Not For You If:
                </h3>
                <ul className="space-y-4">
                  {[
                    "You expect change without doing the exercises.",
                    "You're in immediate physical danger (you need emergency help first).",
                    "You want couples therapy. This is for your healing, not the relationship dynamic."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3" style={{ color: 'var(--navy)', opacity: 0.7 }}>
                      <span style={{ color: 'var(--navy)', opacity: 0.3 }}>✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== ORIGIN STORY ==================== */}
        <section
          className="relative py-24 md:py-32 px-6"
          style={{ background: 'var(--navy)' }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="text-xs uppercase tracking-[0.4em] block mb-4"
              style={{ color: 'var(--gold)' }}
            >
              The Story
            </span>
            <h2
              className="heading-serif text-3xl md:text-4xl lg:text-5xl font-light mb-8"
              style={{ color: 'var(--cream)', lineHeight: 1.1 }}
            >
              How I Discovered{' '}
              <span className="italic" style={{ color: 'var(--light-blue)' }}>
                The Solution
              </span>
            </h2>

            <div className="text-left space-y-6" style={{ color: 'var(--cream)', opacity: 0.85, lineHeight: 1.8 }}>
              <p>
                A few years ago my love life was a mess. I kept chasing the wrong people, overthinking every message, and promising myself I'd 'be stronger next time'—but nothing really changed.
              </p>
              <p>
                After one especially painful breakup, I went all-in: books, therapy, videos, every method I could find.
              </p>
              <p>
                What finally worked wasn't <em>more information</em>—it was having a simple, daily system that actually changed my behaviour and how I saw myself.
              </p>
              <p>
                That system became <strong style={{ color: 'var(--gold)' }}>Twenty One</strong>.
              </p>
              <p>
                It helped me stop obsessing over people who weren't choosing me. Feel calm and grounded instead of anxious and desperate. Show up in relationships with boundaries and self-respect.
              </p>
              <p>
                Now, I want to share the exact process so you can break your own cycle faster, save years of trial and error, and build a love life that feels safe, not chaotic.
              </p>
            </div>
          </div>

          <PaintSplatter
            className="w-[300px] h-[300px] -bottom-16 right-[10%] opacity-10"
            color="var(--light-blue)"
            delay={0}
            scale={0.5}
          />
        </section>

        {/* ==================== PRICING & URGENCY ==================== */}
        <section
          className="relative py-24 md:py-32 px-6"
          style={{ background: 'var(--cream)' }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <span
              className="text-xs uppercase tracking-[0.4em] block mb-4"
              style={{ color: 'var(--gold)' }}
            >
              Limited-Time Launch Pricing
            </span>

            <h2
              className="heading-serif text-3xl md:text-4xl lg:text-5xl font-light mb-6"
              style={{ color: 'var(--navy)', lineHeight: 1.1 }}
            >
              Ready to Feel Emotionally{' '}
              <span className="italic" style={{ color: 'var(--blue)' }}>
                Free in 21 Days?
              </span>
            </h2>

            <div className="w-16 h-px mx-auto mb-8" style={{ background: 'var(--gold)' }} />

            {/* Pricing Card */}
            <div
              className="p-8 md:p-12 mb-8 max-w-lg mx-auto"
              style={{ background: 'var(--white)', boxShadow: '0 16px 48px rgba(26, 46, 74, 0.12)' }}
            >
              <div className="mb-6">
                <span
                  className="text-lg line-through"
                  style={{ color: 'var(--navy)', opacity: 0.4 }}
                >
                  €67
                </span>
                <span
                  className="text-5xl md:text-6xl font-bold ml-4"
                  style={{ color: 'var(--navy)' }}
                >
                  €27
                </span>
                <span className="text-lg ml-2" style={{ color: 'var(--navy)', opacity: 0.6 }}>
                  today only
                </span>
              </div>

              <p className="text-lg mb-6" style={{ color: 'var(--gold)' }}>
                You're saving €40
              </p>

              <Link
                href="/the-twenty-one"
                className="group relative block w-full px-10 py-5 overflow-hidden transition-all duration-500 mb-6"
                style={{ background: 'var(--navy)', color: 'var(--cream)' }}
              >
                <span className="relative z-10 text-sm uppercase tracking-[0.15em] font-semibold">
                  Get Twenty One Now
                </span>
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-0 -translate-x-full"
                  style={{ background: 'var(--blue)' }}
                />
              </Link>

              <p className="text-sm" style={{ color: 'var(--navy)', opacity: 0.5 }}>
                Secure Checkout • Instant Access • Privacy Protected
              </p>
            </div>

            {/* Why It's Smart */}
            <p
              className="text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: 'var(--navy)', opacity: 0.7 }}
            >
              Most people waste months or years trying to figure this out alone. Every month spent guessing is another month stuck in the same cycle. <strong>Twenty One</strong> gives you a proven path so you can skip the mistakes and actually get results.
            </p>
          </div>

          <GoldRect className="top-1/4 left-[5%] opacity-30" size="sm" delay={0} />
          <GoldRect className="bottom-1/4 right-[8%] opacity-40" size="lg" delay={1} />
        </section>

        {/* ==================== GUARANTEE ==================== */}
        <section
          className="relative py-20 md:py-24 px-6"
          style={{ background: 'var(--white)' }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="inline-block px-6 py-3 mb-6"
              style={{ background: 'rgba(212, 160, 57, 0.1)' }}
            >
              <span
                className="text-sm uppercase tracking-wider font-semibold"
                style={{ color: 'var(--gold)' }}
              >
                100% Risk-Free
              </span>
            </div>

            <h2
              className="heading-serif text-2xl md:text-3xl lg:text-4xl font-light mb-6"
              style={{ color: 'var(--navy)', lineHeight: 1.2 }}
            >
              14-Day "Clarity or It's Free"{' '}
              <span className="italic" style={{ color: 'var(--blue)' }}>
                Guarantee
              </span>
            </h2>

            <p
              className="text-lg leading-relaxed"
              style={{ color: 'var(--navy)', opacity: 0.7 }}
            >
              If you don't feel like Twenty One gives you clear, actionable value toward breaking your attachment patterns, just email us within 14 days and we'll refund you in full. No questions asked. The risk is on us. Your only job is to show up and do the work.
            </p>
          </div>
        </section>

        {/* ==================== FINAL CTA ==================== */}
        <section
          className="relative py-24 md:py-32 px-6"
          style={{ background: 'linear-gradient(135deg, var(--blue) 0%, var(--navy) 100%)' }}
        >
          <PaintSplatter
            className="w-[400px] h-[400px] -top-20 -left-32 opacity-10"
            color="var(--light-blue)"
            delay={0}
            scale={0.8}
          />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2
              className="heading-serif text-3xl md:text-4xl lg:text-5xl font-light mb-6"
              style={{ color: 'var(--cream)', lineHeight: 1.1 }}
            >
              Ready to Feel Emotionally{' '}
              <span className="italic" style={{ color: 'var(--light-blue)' }}>
                Free in 21 Days?
              </span>
            </h2>

            <p
              className="text-lg max-w-xl mx-auto mb-10"
              style={{ color: 'var(--cream)', opacity: 0.8 }}
            >
              Get the 21-Day Attachment Reset for only €27 today. Start your journey to healthier love.
            </p>

            <Link
              href="/the-twenty-one"
              className="group relative inline-block px-12 py-5 overflow-hidden transition-all duration-500 mb-6"
              style={{ background: 'var(--gold)', color: 'var(--navy)' }}
            >
              <span className="relative z-10 text-sm uppercase tracking-[0.2em] font-semibold">
                Get Instant Access
              </span>
              <div
                className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-0 -translate-x-full"
                style={{ background: 'var(--amber)' }}
              />
            </Link>

            <p className="text-sm" style={{ color: 'var(--cream)', opacity: 0.5 }}>
              14-day money-back guarantee • Instant access • Secure checkout
            </p>
          </div>

          <GoldRect className="bottom-16 right-[10%] opacity-40" size="md" delay={0.5} />
        </section>

        {/* ==================== FOOTER ==================== */}
        <footer
          className="relative py-20 px-6"
          style={{
            background: 'linear-gradient(180deg, var(--navy) 0%, #0f1a2a 100%)'
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center">
              {/* Brand Logo Image */}
              <div className="mb-8">
                <img
                  src="/brand-logo.jpg"
                  alt="21|Twenty One"
                  className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-sm"
                  style={{
                    boxShadow: '0 8px 32px rgba(212, 160, 57, 0.2)',
                    border: '2px solid rgba(212, 160, 57, 0.3)'
                  }}
                />
              </div>

              <div className="w-16 h-px mb-8" style={{ background: 'var(--gold)' }} />

              <p
                className="max-w-md mb-12"
                style={{ color: 'var(--cream)', opacity: 0.5 }}
              >
                Heal your attachment. Build healthy relationships.
                Your 21-day journey to emotional freedom.
              </p>

              {/* Links */}
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                {[
                  { label: 'Privacy', href: '/privacy' },
                  { label: 'Terms', href: '/terms' },
                  { label: 'Pricing', href: '/pricing' },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[var(--gold)]"
                    style={{ color: 'var(--cream)', opacity: 0.6 }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Copyright */}
              <p
                className="text-xs"
                style={{ color: 'var(--cream)', opacity: 0.3 }}
              >
                &copy; {new Date().getFullYear()} 21|Twenty One. All rights reserved.
              </p>
            </div>
          </div>

          <GoldRect className="top-12 left-[10%] opacity-20" size="sm" delay={0} />
          <GoldRect className="bottom-20 right-[12%] opacity-15" size="md" delay={0.5} />
        </footer>
      </div>
    </>
  );
}
