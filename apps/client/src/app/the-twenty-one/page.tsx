"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

// Scroll-triggered section hook
const useIntersectionObserver = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return visibleSections;
};

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
      className={`absolute transition-all duration-1000 ease-out ${className}`}
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
      <ellipse cx="45" cy="60" rx="12" ry="8" fill={color} style={{ animationDelay: '0.5s' }} />
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
    sm: 'w-8 h-12',
    md: 'w-12 h-20',
    lg: 'w-16 h-28'
  };

  return (
    <div
      className={`absolute ${sizes[size]} ${className}`}
      style={{
        background: 'linear-gradient(135deg, #BA5448 0%, #C1918C 50%, #BA5448 100%)',
        animationDelay: `${delay}s`,
        boxShadow: '0 8px 32px rgba(186, 84, 72, 0.3)'
      }}
    />
  );
};

// Grain Overlay
const GrainOverlay = () => (
  <div
    className="fixed inset-0 pointer-events-none z-50 opacity-[0.08]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

// Week Card Component
const WeekCard = ({
  week,
  title,
  description,
  items,
  isActive
}: {
  week: string;
  title: string;
  description: string;
  items: string[];
  isActive?: boolean;
}) => {
  return (
    <div
      className="relative p-8 md:p-10 transition-all duration-500 hover:translate-y-[-4px]"
      style={{
        background: isActive ? 'var(--navy)' : 'var(--white)',
        border: isActive ? 'none' : '1px solid rgba(129, 53, 46, 0.1)'
      }}
    >
      <span
        className="text-xs uppercase tracking-[0.3em] block mb-4"
        style={{ color: 'var(--gold)' }}
      >
        {week}
      </span>
      <h3
        className="heading-serif text-2xl md:text-3xl font-light mb-4"
        style={{ color: isActive ? 'var(--cream)' : 'var(--navy)' }}
      >
        {title}
      </h3>
      <p
        className="mb-6 leading-relaxed"
        style={{
          color: isActive ? 'var(--cream)' : 'var(--navy)',
          opacity: 0.7
        }}
      >
        {description}
      </p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 text-sm"
            style={{ color: isActive ? 'var(--cream)' : 'var(--navy)' }}
          >
            <span style={{ color: 'var(--gold)' }}>•</span>
            <span style={{ opacity: 0.8 }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function TheTwentyOnePage() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const visibleSections = useIntersectionObserver();

  useEffect(() => {
    setIsLoaded(true);

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
          --navy: #81352E;
          --blue: #9D433A;
          --gold: #BA5448;
          --cream: #FBE9E7;
          --amber: #C1918C;
          --light-blue: #E6C8C3;
          --white: #ffffff;
        }

        .twenty-one-page {
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

        @keyframes drip {
          0% { transform: scaleY(0); transform-origin: top; }
          100% { transform: scaleY(1); transform-origin: top; }
        }

        .animate-drip {
          animation: drip 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes line-grow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        .line-grow {
          animation: line-grow 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: left;
        }

        .fade-in-section {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .fade-in-section.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className="twenty-one-page min-h-screen overflow-x-hidden pt-20">
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
          id="hero"
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{ background: 'var(--cream)' }}
        >
          {/* Animated Paint Splatters */}
          <PaintSplatter
            className="w-[600px] h-[600px] -top-20 -left-40 paint-expand"
            color="rgba(157, 67, 58, 0.15)"
            delay={300}
            scale={1.2}
          />
          <PaintSplatter
            className="w-[500px] h-[500px] -bottom-32 -right-20 paint-expand"
            color="rgba(129, 53, 46, 0.12)"
            delay={600}
            scale={1}
          />
          <PaintSplatter
            className="w-[400px] h-[400px] top-1/4 right-1/4 paint-expand"
            color="rgba(230, 200, 195, 0.1)"
            delay={900}
            scale={0.8}
          />

          {/* Floating Gold Rectangles */}
          <GoldRect className="top-[15%] left-[10%] animate-float-gold" size="md" delay={0.5} />
          <GoldRect className="top-[25%] right-[15%] animate-float-gold" size="lg" delay={1} />
          <GoldRect className="bottom-[20%] left-[20%] animate-float-gold" size="sm" delay={1.5} />
          <GoldRect className="bottom-[30%] right-[25%] animate-float-gold" size="md" delay={2} />

          {/* Hero Content */}
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            {/* Badge */}
            <div
              className={`overflow-hidden ${isLoaded ? 'reveal-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.2s' }}
            >
              <span
                className="inline-block px-4 py-2 text-xs uppercase tracking-[0.3em] mb-6"
                style={{
                  background: 'var(--gold)',
                  color: 'var(--navy)',
                  fontWeight: 600
                }}
              >
                21-Day Protocol
              </span>
            </div>

            <h1
              className={`heading-serif text-5xl md:text-7xl lg:text-8xl font-light mb-8 ${isLoaded ? 'reveal-up' : 'opacity-0'}`}
              style={{
                color: 'var(--navy)',
                animationDelay: '0.4s',
                lineHeight: 0.95
              }}
            >
              <span className="block">Break Free From</span>
              <span
                className="block italic"
                style={{ color: 'var(--blue)' }}
              >
                Toxic Attachment
              </span>
            </h1>

            {/* Decorative Line */}
            <div
              className={`w-24 h-px mx-auto mb-8 ${isLoaded ? 'line-grow' : ''}`}
              style={{
                background: 'var(--gold)',
                animationDelay: '0.8s'
              }}
            />

            <p
              className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 ${isLoaded ? 'reveal-up' : 'opacity-0'}`}
              style={{
                color: 'var(--navy)',
                opacity: 0.8,
                animationDelay: '0.6s',
                fontWeight: 300,
                letterSpacing: '0.02em',
                lineHeight: 1.7
              }}
            >
              A science-backed 21-day journey to heal your attachment wounds,
              calm your anxious mind, and build the foundation for
              <strong> healthy, secure love</strong>.
            </p>

            {/* CTA Button */}
            <div
              className={`${isLoaded ? 'reveal-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.8s' }}
            >
              <Link
                href="/dashboard"
                className="group relative inline-block px-12 py-5 overflow-hidden transition-all duration-500"
                style={{ background: 'var(--navy)', color: 'var(--cream)' }}
              >
                <span className="relative z-10 text-sm uppercase tracking-[0.2em] font-medium">
                  Start Your Healing Journey
                </span>
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-0 -translate-x-full"
                  style={{ background: 'var(--blue)' }}
                />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div
              className={`flex flex-wrap items-center justify-center gap-6 mt-8 text-sm ${isLoaded ? 'reveal-up' : 'opacity-0'}`}
              style={{ animationDelay: '1s', color: 'var(--navy)', opacity: 0.5 }}
            >
              <span>21 Days</span>
              <span style={{ color: 'var(--gold)' }}>•</span>
              <span>Daily Exercises</span>
              <span style={{ color: 'var(--gold)' }}>•</span>
              <span>Proven Results</span>
            </div>

            {/* Scroll Indicator */}
            <div
              className={`absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 ${isLoaded ? 'reveal-up' : 'opacity-0'}`}
              style={{ animationDelay: '1.2s' }}
            >
              <span
                className="text-xs uppercase tracking-[0.3em]"
                style={{ color: 'var(--navy)', opacity: 0.5 }}
              >
                Discover
              </span>
              <div
                className="w-px h-12"
                style={{
                  background: 'linear-gradient(to bottom, var(--gold), transparent)'
                }}
              />
            </div>
          </div>
        </section>

        {/* ==================== THE PROBLEM SECTION ==================== */}
        <section
          id="problem"
          data-animate
          className="relative py-32 md:py-48 px-6"
          style={{ background: 'var(--navy)' }}
        >
          <GoldRect className="top-20 right-[10%] animate-float-gold opacity-60" size="sm" delay={0} />
          <GoldRect className="bottom-32 left-[5%] animate-float-gold opacity-40" size="md" delay={0.5} />

          <div className="max-w-4xl mx-auto text-center">
            <span
              className="text-xs uppercase tracking-[0.4em] block mb-6"
              style={{ color: 'var(--gold)' }}
            >
              The Challenge
            </span>

            <h2
              className="heading-serif text-4xl md:text-5xl lg:text-6xl font-light mb-8"
              style={{
                color: 'var(--cream)',
                lineHeight: 1.1
              }}
            >
              Are you tired of
              <span className="italic block" style={{ color: 'var(--light-blue)' }}>
                repeating the same patterns?
              </span>
            </h2>

            <div
              className="w-16 h-px mx-auto mb-12"
              style={{ background: 'var(--gold)' }}
            />

            <div className="grid md:grid-cols-2 gap-8 text-left mb-12">
              {[
                "Obsessing over someone who doesn't choose you",
                "Feeling anxious when they don't text back",
                "Losing yourself in relationships",
                "Attracting unavailable partners",
                "Struggling to set healthy boundaries",
                "Breaking up and getting back together repeatedly"
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start"
                  style={{ color: 'var(--cream)' }}
                >
                  <span
                    className="w-2 h-2 mt-2 rounded-full flex-shrink-0"
                    style={{ background: 'var(--gold)' }}
                  />
                  <p style={{ opacity: 0.8 }}>{item}</p>
                </div>
              ))}
            </div>

            <p
              className="text-xl md:text-2xl heading-serif italic"
              style={{ color: 'var(--light-blue)' }}
            >
              It's not your fault. It's your attachment style.
              <br />
              And it can be healed.
            </p>
          </div>

          <PaintSplatter
            className="w-[300px] h-[300px] -bottom-20 right-[20%] opacity-20"
            color="var(--light-blue)"
            delay={0}
            scale={0.6}
          />
        </section>

        {/* ==================== THE SOLUTION SECTION ==================== */}
        <section
          id="solution"
          className="relative py-32 md:py-48 px-6 overflow-hidden"
          style={{ background: 'var(--cream)' }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <span
                className="text-xs uppercase tracking-[0.4em] block mb-4"
                style={{ color: 'var(--gold)' }}
              >
                The Solution
              </span>
              <h2
                className="heading-serif text-4xl md:text-6xl lg:text-7xl font-light"
                style={{
                  color: 'var(--navy)',
                  lineHeight: 1.1
                }}
              >
                The <span className="italic">21 Protocol</span>
              </h2>
              <div
                className="w-16 h-px mx-auto mt-8 mb-8"
                style={{ background: 'var(--gold)' }}
              />
              <p
                className="text-lg md:text-xl max-w-3xl mx-auto"
                style={{ color: 'var(--navy)', opacity: 0.7, lineHeight: 1.7 }}
              >
                A structured 21-day program designed to rewire your attachment patterns
                through daily exercises, proven techniques, and practical tools you can
                use in real-life situations.
              </p>
            </div>

            {/* Three Weeks Grid */}
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <WeekCard
                week="Week 1"
                title="Awareness & Understanding"
                description="Discover your attachment style and understand why you react the way you do."
                items={[
                  "Identify your attachment triggers",
                  "Understand your emotional patterns",
                  "Map your relationship history",
                  "Recognize unhealthy dynamics"
                ]}
              />
              <WeekCard
                week="Week 2"
                title="Healing & Regulation"
                description="Learn to calm your nervous system and process difficult emotions."
                items={[
                  "Emotional regulation techniques",
                  "Anxiety and urge management",
                  "Inner child healing exercises",
                  "Building self-soothing skills"
                ]}
                isActive
              />
              <WeekCard
                week="Week 3"
                title="Boundaries & Growth"
                description="Build healthy boundaries and prepare for secure relationships."
                items={[
                  "Setting and maintaining boundaries",
                  "Healthy communication scripts",
                  "Standards for future partners",
                  "Creating your new love story"
                ]}
              />
            </div>
          </div>

          <GoldRect className="top-1/4 right-[3%] animate-float-gold opacity-40" size="md" delay={0} />
          <GoldRect className="bottom-1/3 left-[2%] animate-float-gold opacity-30" size="lg" delay={1.2} />
        </section>

        {/* ==================== WHAT'S INCLUDED ==================== */}
        <section
          id="included"
          className="relative py-32 md:py-48 px-6"
          style={{ background: 'var(--white)' }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span
                className="text-xs uppercase tracking-[0.4em] block mb-4"
                style={{ color: 'var(--gold)' }}
              >
                What's Included
              </span>
              <h2
                className="heading-serif text-4xl md:text-5xl lg:text-6xl font-light"
                style={{ color: 'var(--navy)', lineHeight: 1.1 }}
              >
                Everything You Need to{' '}
                <span className="italic" style={{ color: 'var(--blue)' }}>
                  Heal
                </span>
              </h2>
              <div className="w-16 h-px mx-auto mt-8" style={{ background: 'var(--gold)' }} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "21 Daily Lessons",
                  description: "Bite-sized lessons designed for busy lives. Just 15-20 minutes a day."
                },
                {
                  title: "Guided Exercises",
                  description: "Practical exercises that create real change in how you think and feel."
                },
                {
                  title: "Video Trainings",
                  description: "Deep-dive video modules on attachment, boundaries, and self-worth."
                },
                {
                  title: "PDF Workbook",
                  description: "Your personal journal with prompts, checklists, and trackers."
                },
                {
                  title: "Scripts & Templates",
                  description: "What to say (and not say) in triggering moments and difficult conversations."
                },
                {
                  title: "Emergency Tools",
                  description: "Calming audios and quick techniques for when emotions spike."
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-8 transition-all duration-500 hover:translate-y-[-4px]"
                  style={{
                    background: 'var(--cream)',
                    border: '1px solid rgba(129, 53, 46, 0.08)'
                  }}
                >
                  <h3
                    className="heading-serif text-xl font-semibold mb-3"
                    style={{ color: 'var(--navy)' }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--navy)', opacity: 0.7, lineHeight: 1.7 }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== TRANSFORMATION SECTION ==================== */}
        <section
          id="transformation"
          className="relative py-32 md:py-48 px-6"
          style={{ background: 'linear-gradient(135deg, var(--blue) 0%, var(--navy) 100%)' }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <span
              className="text-xs uppercase tracking-[0.4em] block mb-6"
              style={{ color: 'var(--gold)' }}
            >
              Your Transformation
            </span>

            <h2
              className="heading-serif text-4xl md:text-5xl lg:text-6xl font-light mb-12"
              style={{ color: 'var(--cream)', lineHeight: 1.1 }}
            >
              In 21 Days,{' '}
              <span className="italic" style={{ color: 'var(--light-blue)' }}>
                You Will...
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8 text-left">
              {[
                "Stop obsessing over people who don't choose you",
                "Feel calm and grounded instead of anxious",
                "Set healthy boundaries without guilt",
                "Trust yourself and your worth",
                "Attract partners who are emotionally available",
                "Break the cycle of toxic relationships"
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start p-4"
                  style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <span style={{ color: 'var(--gold)', fontSize: '1.25rem' }}>✓</span>
                  <p style={{ color: 'var(--cream)', fontSize: '1.1rem' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <PaintSplatter
            className="w-[300px] h-[300px] -bottom-16 left-[10%] opacity-10"
            color="var(--light-blue)"
            delay={0}
            scale={0.6}
          />
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section
          id="cta"
          className="relative py-32 md:py-48 px-6"
          style={{ background: 'var(--cream)' }}
        >
          <PaintSplatter
            className="w-[400px] h-[400px] -top-20 -left-40 opacity-10"
            color="var(--blue)"
            delay={0}
            scale={0.8}
          />
          <PaintSplatter
            className="w-[300px] h-[300px] -bottom-10 -right-20 opacity-10"
            color="var(--navy)"
            delay={200}
            scale={0.6}
          />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <span
              className="text-xs uppercase tracking-[0.4em] block mb-6"
              style={{ color: 'var(--gold)' }}
            >
              Begin Today
            </span>

            <h2
              className="heading-serif text-4xl md:text-6xl lg:text-7xl font-light mb-8"
              style={{
                color: 'var(--navy)',
                lineHeight: 1.1
              }}
            >
              Ready to heal your{' '}
              <span className="italic block" style={{ color: 'var(--blue)' }}>
                attachment wounds?
              </span>
            </h2>

            <div
              className="w-16 h-px mx-auto mb-8"
              style={{ background: 'var(--gold)' }}
            />

            <p
              className="text-lg md:text-xl mb-12"
              style={{ color: 'var(--navy)', opacity: 0.7, lineHeight: 1.7 }}
            >
              Start your 21-day journey to emotional freedom.
              Build the foundation for healthy, secure love.
            </p>

            <Link
              href="/dashboard"
              className="group relative inline-block px-14 py-6 overflow-hidden transition-all duration-500 mb-8"
              style={{ background: 'var(--navy)', color: 'var(--cream)' }}
            >
              <span className="relative z-10 text-sm uppercase tracking-[0.2em] font-semibold">
                Start The 21 Protocol Now
              </span>
              <div
                className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-0 -translate-x-full"
                style={{ background: 'var(--blue)' }}
              />
            </Link>

            <p
              className="text-sm"
              style={{ color: 'var(--navy)', opacity: 0.5 }}
            >
              Join thousands who have transformed their relationships
            </p>
          </div>

          <GoldRect className="top-1/4 left-[5%] animate-float-gold opacity-20" size="md" delay={0.5} />
          <GoldRect className="bottom-1/4 right-[8%] animate-float-gold opacity-30" size="sm" delay={1.5} />
        </section>

        {/* ==================== FOOTER ==================== */}
        <footer
          className="relative py-16 px-6 border-t"
          style={{
            background: '#0a1420',
            borderColor: 'rgba(251, 233, 231, 0.1)'
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              {/* Logo */}
              <div className="text-center md:text-left">
                <span
                  className="heading-serif text-2xl"
                  style={{ color: 'var(--cream)' }}
                >
                  21 | <span className="italic">Twenty One</span>
                </span>
              </div>

              {/* Links */}
              <div className="flex gap-8">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'Assessment', href: '/assessment' }
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
                style={{ color: 'var(--cream)', opacity: 0.4 }}
              >
                &copy; {new Date().getFullYear()} 21|Twenty One. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
