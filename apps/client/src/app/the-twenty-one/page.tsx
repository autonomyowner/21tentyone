"use client";

import { useEffect, useState, useRef, useCallback } from "react";

// Custom Navigation
const Navigation = ({ scrollY }: { scrollY: number }) => {
  const isScrolled = scrollY > 100;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 transition-all duration-500"
        style={{
          background: isScrolled ? 'rgba(26, 46, 74, 0.95)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="heading-serif text-xl md:text-2xl transition-colors duration-300"
            style={{ color: isScrolled ? 'var(--cream)' : 'var(--navy)' }}
          >
            T<span className="italic">21</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-12">
            {['Studio', 'Work', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:opacity-100 relative group"
                style={{
                  color: isScrolled ? 'var(--cream)' : 'var(--navy)',
                  opacity: 0.7
                }}
              >
                {item}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                  style={{ background: 'var(--gold)' }}
                />
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              className="w-6 h-px transition-all duration-300"
              style={{
                background: isScrolled ? 'var(--cream)' : 'var(--navy)',
                transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none'
              }}
            />
            <span
              className="w-6 h-px transition-all duration-300"
              style={{
                background: isScrolled ? 'var(--cream)' : 'var(--navy)',
                opacity: menuOpen ? 0 : 1
              }}
            />
            <span
              className="w-6 h-px transition-all duration-300"
              style={{
                background: isScrolled ? 'var(--cream)' : 'var(--navy)',
                transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none'
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-500"
        style={{
          background: 'var(--navy)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {['Studio', 'Work', 'About', 'Contact'].map((item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="heading-serif text-4xl transition-all duration-500"
              style={{
                color: 'var(--cream)',
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: menuOpen ? 1 : 0,
                transitionDelay: `${i * 100}ms`
              }}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

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
    className="fixed inset-0 pointer-events-none z-50 opacity-[0.08]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

// Work/Portfolio Item
const WorkItem = ({
  title,
  category,
  index
}: {
  title: string;
  category: string;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative group cursor-pointer overflow-hidden ${
        index % 3 === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        aspectRatio: index % 3 === 0 ? '1' : index % 2 === 0 ? '3/4' : '4/3'
      }}
    >
      <div
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{
          background: `linear-gradient(${135 + index * 45}deg,
            ${index % 2 === 0 ? '#1a2e4a' : '#2d5a8a'} 0%,
            ${index % 3 === 0 ? '#6b9cc4' : '#1a2e4a'} 100%)`,
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
      />

      {/* Paint splatter on hover */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: isHovered ? 0.3 : 0 }}
      >
        <PaintSplatter
          className="w-full h-full"
          color="rgba(212, 160, 57, 0.6)"
          scale={isHovered ? 1 : 0.5}
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div
          className="transform transition-all duration-500"
          style={{
            transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
            opacity: isHovered ? 1 : 0.7
          }}
        >
          <span
            className="text-xs uppercase tracking-[0.3em] mb-2 block"
            style={{
              color: '#d4a039',
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            {category}
          </span>
          <h3
            className="text-xl md:text-2xl"
            style={{
              color: '#f5f0e8',
              fontFamily: 'Cormorant Garamond, serif',
              fontWeight: 500
            }}
          >
            {title}
          </h3>
        </div>
      </div>

      {/* Gold corner accent */}
      <div
        className="absolute top-0 right-0 w-12 h-12 transition-all duration-500"
        style={{
          background: 'linear-gradient(135deg, transparent 50%, #d4a039 50%)',
          transform: isHovered ? 'translate(0, 0)' : 'translate(20px, -20px)',
          opacity: isHovered ? 1 : 0
        }}
      />
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

  const works = [
    { title: "Ethereal Visions", category: "Branding" },
    { title: "Chromatic Dreams", category: "Art Direction" },
    { title: "Silent Echoes", category: "Photography" },
    { title: "Abstract Horizons", category: "Digital Art" },
    { title: "Fluid Motion", category: "Motion Design" },
    { title: "Tactile Memories", category: "Installation" },
  ];

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

        /* Custom cursor */
        .cursor-gallery {
          cursor: none;
        }

        .cursor-gallery::after {
          content: '';
          position: fixed;
          width: 40px;
          height: 40px;
          border: 2px solid var(--gold);
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: all 0.15s ease-out;
          z-index: 9999;
        }

        /* Scroll-triggered animations */
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

      <div className="twenty-one-page min-h-screen overflow-x-hidden">
        <GrainOverlay />
        <Navigation scrollY={scrollY} />

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
          id="studio"
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{ background: 'var(--cream)' }}
        >
          {/* Animated Paint Splatters */}
          <PaintSplatter
            className="w-[600px] h-[600px] -top-20 -left-40 paint-expand"
            color="rgba(45, 90, 138, 0.15)"
            delay={300}
            scale={1.2}
          />
          <PaintSplatter
            className="w-[500px] h-[500px] -bottom-32 -right-20 paint-expand"
            color="rgba(26, 46, 74, 0.12)"
            delay={600}
            scale={1}
          />
          <PaintSplatter
            className="w-[400px] h-[400px] top-1/4 right-1/4 paint-expand"
            color="rgba(107, 156, 196, 0.1)"
            delay={900}
            scale={0.8}
          />

          {/* Blue Explosion Center */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
            style={{
              background: 'radial-gradient(circle, rgba(45, 90, 138, 0.08) 0%, rgba(107, 156, 196, 0.04) 40%, transparent 70%)',
              transform: `translate(-50%, -50%) scale(${1 + scrollY * 0.0005})`,
              transition: 'transform 0.1s ease-out'
            }}
          />

          {/* Floating Gold Rectangles */}
          <GoldRect className="top-[15%] left-[10%] animate-float-gold" size="md" delay={0.5} />
          <GoldRect className="top-[25%] right-[15%] animate-float-gold" size="lg" delay={1} />
          <GoldRect className="bottom-[20%] left-[20%] animate-float-gold" size="sm" delay={1.5} />
          <GoldRect className="bottom-[30%] right-[25%] animate-float-gold" size="md" delay={2} />
          <GoldRect className="top-[60%] left-[8%] animate-float-gold" size="sm" delay={0.8} />

          {/* Paint Drips */}
          <div
            className="absolute top-0 left-[30%] w-1 h-40 animate-drip"
            style={{
              background: 'linear-gradient(to bottom, var(--blue), transparent)',
              animationDelay: '1s'
            }}
          />
          <div
            className="absolute top-0 right-[25%] w-0.5 h-28 animate-drip"
            style={{
              background: 'linear-gradient(to bottom, var(--gold), transparent)',
              animationDelay: '1.5s'
            }}
          />

          {/* Hero Content */}
          <div className="relative z-10 text-center px-6">
            {/* Logo Text */}
            <div
              className={`overflow-hidden ${isLoaded ? 'reveal-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.2s' }}
            >
              <span
                className="text-sm uppercase tracking-[0.5em] block mb-6"
                style={{
                  color: 'var(--gold)',
                  fontWeight: 500,
                  letterSpacing: '0.5em'
                }}
              >
                Creative Studio
              </span>
            </div>

            <h1
              className={`heading-serif text-6xl md:text-8xl lg:text-9xl font-light mb-8 ${isLoaded ? 'reveal-up' : 'opacity-0'}`}
              style={{
                color: 'var(--navy)',
                animationDelay: '0.4s',
                lineHeight: 0.9
              }}
            >
              <span className="block">The</span>
              <span
                className="block italic"
                style={{ color: 'var(--blue)' }}
              >
                Twenty One
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
              className={`text-lg md:text-xl max-w-md mx-auto ${isLoaded ? 'reveal-up' : 'opacity-0'}`}
              style={{
                color: 'var(--navy)',
                opacity: 0.7,
                animationDelay: '0.6s',
                fontWeight: 300,
                letterSpacing: '0.05em'
              }}
            >
              Where artistry meets intention.<br />
              Crafting unforgettable experiences.
            </p>

            {/* Scroll Indicator */}
            <div
              className={`absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 ${isLoaded ? 'reveal-up' : 'opacity-0'}`}
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
                style={{
                  background: 'linear-gradient(to bottom, var(--gold), transparent)'
                }}
              />
            </div>
          </div>

          {/* Parallax Elements */}
          <div
            className="absolute w-20 h-20 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212, 160, 57, 0.3) 0%, transparent 70%)',
              top: '30%',
              left: '60%',
              transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`
            }}
          />
        </section>

        {/* ==================== ABOUT SECTION ==================== */}
        <section
          id="about"
          data-animate
          className="relative py-32 md:py-48 px-6"
          style={{ background: 'var(--navy)' }}
        >
          {/* Scattered Gold Accents */}
          <GoldRect className="top-20 right-[10%] animate-float-gold opacity-60" size="sm" delay={0} />
          <GoldRect className="bottom-32 left-[5%] animate-float-gold opacity-40" size="md" delay={0.5} />

          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-12 gap-12 md:gap-8 items-center">
              {/* Left: Large Number */}
              <div className="md:col-span-4 relative">
                <span
                  className="heading-serif text-[200px] md:text-[300px] font-light leading-none"
                  style={{
                    color: 'var(--blue)',
                    opacity: 0.3
                  }}
                >
                  21
                </span>
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24"
                  style={{
                    background: 'var(--gold)',
                    opacity: 0.8
                  }}
                />
              </div>

              {/* Right: Content */}
              <div className="md:col-span-7 md:col-start-6">
                <span
                  className="text-xs uppercase tracking-[0.4em] block mb-6"
                  style={{ color: 'var(--gold)' }}
                >
                  Our Philosophy
                </span>

                <h2
                  className="heading-serif text-4xl md:text-5xl lg:text-6xl font-light mb-8"
                  style={{
                    color: 'var(--cream)',
                    lineHeight: 1.1
                  }}
                >
                  We believe in the
                  <span className="italic" style={{ color: 'var(--light-blue)' }}> power </span>
                  of thoughtful design
                </h2>

                <div
                  className="w-16 h-px mb-8"
                  style={{ background: 'var(--gold)' }}
                />

                <p
                  className="text-lg md:text-xl mb-6 leading-relaxed"
                  style={{
                    color: 'var(--cream)',
                    opacity: 0.7,
                    fontWeight: 300
                  }}
                >
                  Every stroke, every pixel, every moment is crafted with intention.
                  We don&apos;t follow trends—we set them. Our work lives at the
                  intersection of art and strategy.
                </p>

                <p
                  className="text-base leading-relaxed"
                  style={{
                    color: 'var(--cream)',
                    opacity: 0.5,
                    fontWeight: 300
                  }}
                >
                  Founded with a vision to transform brands into unforgettable
                  experiences, The Twenty One brings together visionaries,
                  artists, and strategists who dare to think differently.
                </p>
              </div>
            </div>
          </div>

          {/* Paint Splatter Accent */}
          <PaintSplatter
            className="w-[300px] h-[300px] -bottom-20 right-[20%] opacity-20"
            color="var(--light-blue)"
            delay={0}
            scale={0.6}
          />
        </section>

        {/* ==================== SERVICES SECTION ==================== */}
        <section
          className="relative py-32 md:py-48 px-6 overflow-hidden"
          style={{ background: 'var(--cream)' }}
        >
          {/* Background Decorations */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, var(--blue) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, var(--navy) 0%, transparent 50%)
              `
            }}
          />

          <div className="max-w-7xl mx-auto relative">
            {/* Section Header */}
            <div className="text-center mb-20 md:mb-32">
              <span
                className="text-xs uppercase tracking-[0.4em] block mb-4"
                style={{ color: 'var(--gold)' }}
              >
                What We Do
              </span>
              <h2
                className="heading-serif text-4xl md:text-6xl lg:text-7xl font-light"
                style={{
                  color: 'var(--navy)',
                  lineHeight: 1.1
                }}
              >
                Crafting <span className="italic">Experiences</span>
              </h2>
            </div>

            {/* Services Grid - Asymmetric */}
            <div className="grid md:grid-cols-12 gap-8 md:gap-12">
              {/* Service 1 - Large */}
              <div className="md:col-span-7 group">
                <div
                  className="relative p-8 md:p-12 transition-all duration-500 group-hover:translate-y-[-4px]"
                  style={{
                    background: 'var(--navy)',
                    minHeight: '400px'
                  }}
                >
                  <GoldRect className="absolute top-6 right-6 opacity-60" size="sm" />

                  <span
                    className="text-[120px] md:text-[180px] font-light absolute -top-8 -left-4 opacity-10 heading-serif"
                    style={{ color: 'var(--light-blue)' }}
                  >
                    01
                  </span>

                  <div className="relative z-10 h-full flex flex-col justify-end">
                    <h3
                      className="heading-serif text-3xl md:text-4xl font-light mb-4"
                      style={{ color: 'var(--cream)' }}
                    >
                      Brand <span className="italic">Identity</span>
                    </h3>
                    <p
                      className="text-base leading-relaxed max-w-md"
                      style={{ color: 'var(--cream)', opacity: 0.6 }}
                    >
                      We craft visual identities that tell your story. From logos to complete
                      brand systems, every element is designed with purpose and precision.
                    </p>

                    <div
                      className="w-12 h-px mt-8 transition-all duration-500 group-hover:w-24"
                      style={{ background: 'var(--gold)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Service 2 - Small Top */}
              <div className="md:col-span-5 group">
                <div
                  className="relative p-8 md:p-10 transition-all duration-500 group-hover:translate-y-[-4px]"
                  style={{
                    background: 'linear-gradient(135deg, var(--blue) 0%, var(--navy) 100%)',
                    minHeight: '250px'
                  }}
                >
                  <span
                    className="text-[80px] font-light absolute -top-4 -right-2 opacity-10 heading-serif"
                    style={{ color: 'var(--cream)' }}
                  >
                    02
                  </span>

                  <div className="relative z-10 h-full flex flex-col justify-end">
                    <h3
                      className="heading-serif text-2xl md:text-3xl font-light mb-3"
                      style={{ color: 'var(--cream)' }}
                    >
                      Art <span className="italic">Direction</span>
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--cream)', opacity: 0.6 }}
                    >
                      Visual storytelling that captivates and inspires.
                    </p>
                  </div>
                </div>
              </div>

              {/* Service 3 - Small Bottom */}
              <div className="md:col-span-5 md:col-start-1 group">
                <div
                  className="relative p-8 md:p-10 transition-all duration-500 group-hover:translate-y-[-4px]"
                  style={{
                    border: '1px solid var(--navy)',
                    minHeight: '250px'
                  }}
                >
                  <span
                    className="text-[80px] font-light absolute -top-4 -right-2 opacity-10 heading-serif"
                    style={{ color: 'var(--navy)' }}
                  >
                    03
                  </span>

                  <div className="relative z-10 h-full flex flex-col justify-end">
                    <h3
                      className="heading-serif text-2xl md:text-3xl font-light mb-3"
                      style={{ color: 'var(--navy)' }}
                    >
                      Digital <span className="italic">Design</span>
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--navy)', opacity: 0.6 }}
                    >
                      Websites and apps that feel as good as they look.
                    </p>
                  </div>
                </div>
              </div>

              {/* Service 4 - Large */}
              <div className="md:col-span-7 group">
                <div
                  className="relative p-8 md:p-12 transition-all duration-500 group-hover:translate-y-[-4px]"
                  style={{
                    background: 'linear-gradient(135deg, var(--gold) 0%, var(--amber) 100%)',
                    minHeight: '300px'
                  }}
                >
                  <span
                    className="text-[120px] md:text-[160px] font-light absolute -bottom-8 -right-4 opacity-20 heading-serif"
                    style={{ color: 'var(--navy)' }}
                  >
                    04
                  </span>

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <h3
                        className="heading-serif text-3xl md:text-4xl font-light mb-4"
                        style={{ color: 'var(--navy)' }}
                      >
                        Motion <span className="italic">& Film</span>
                      </h3>
                      <p
                        className="text-base leading-relaxed max-w-md"
                        style={{ color: 'var(--navy)', opacity: 0.7 }}
                      >
                        From subtle animations to full productions, we bring
                        brands to life through the power of motion.
                      </p>
                    </div>

                    <div
                      className="w-12 h-px transition-all duration-500 group-hover:w-24"
                      style={{ background: 'var(--navy)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Gold Accents */}
          <GoldRect className="top-1/4 right-[3%] animate-float-gold opacity-40" size="md" delay={0} />
          <GoldRect className="bottom-1/3 left-[2%] animate-float-gold opacity-30" size="lg" delay={1.2} />
        </section>

        {/* ==================== WORK/GALLERY SECTION ==================== */}
        <section
          id="work"
          data-animate
          className="relative py-32 md:py-48 px-6"
          style={{ background: 'var(--cream)' }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24">
              <div>
                <span
                  className="text-xs uppercase tracking-[0.4em] block mb-4"
                  style={{ color: 'var(--gold)' }}
                >
                  Selected Works
                </span>
                <h2
                  className="heading-serif text-4xl md:text-6xl font-light"
                  style={{
                    color: 'var(--navy)',
                    lineHeight: 1.1
                  }}
                >
                  Our <span className="italic">Gallery</span>
                </h2>
              </div>

              <a
                href="#"
                className="mt-6 md:mt-0 text-sm uppercase tracking-[0.2em] flex items-center gap-3 group"
                style={{ color: 'var(--navy)' }}
              >
                View All Works
                <span
                  className="w-8 h-px transition-all duration-300 group-hover:w-12"
                  style={{ background: 'var(--gold)' }}
                />
              </a>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
              {works.map((work, index) => (
                <WorkItem
                  key={index}
                  title={work.title}
                  category={work.category}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Floating Decorations */}
          <GoldRect className="top-40 left-[5%] animate-float-gold opacity-30" size="lg" delay={0} />
          <GoldRect className="bottom-20 right-[8%] animate-float-gold opacity-50" size="sm" delay={1} />
        </section>

        {/* ==================== CONTACT SECTION ==================== */}
        <section
          id="contact"
          data-animate
          className="relative py-32 md:py-48 px-6"
          style={{
            background: 'linear-gradient(180deg, var(--navy) 0%, #0f1a2a 100%)'
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            {/* Decorative Paint Splatters */}
            <PaintSplatter
              className="w-[400px] h-[400px] -top-20 -left-40 opacity-10"
              color="var(--blue)"
              delay={0}
              scale={0.8}
            />
            <PaintSplatter
              className="w-[300px] h-[300px] -bottom-10 -right-20 opacity-10"
              color="var(--light-blue)"
              delay={200}
              scale={0.6}
            />

            <span
              className="text-xs uppercase tracking-[0.4em] block mb-6"
              style={{ color: 'var(--gold)' }}
            >
              Get In Touch
            </span>

            <h2
              className="heading-serif text-4xl md:text-6xl lg:text-7xl font-light mb-8"
              style={{
                color: 'var(--cream)',
                lineHeight: 1.1
              }}
            >
              Let&apos;s create something
              <span className="italic block" style={{ color: 'var(--light-blue)' }}>
                extraordinary
              </span>
            </h2>

            <div
              className="w-16 h-px mx-auto mb-12"
              style={{ background: 'var(--gold)' }}
            />

            {/* Contact Form */}
            <form className="max-w-xl mx-auto space-y-6 text-left">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="text-xs uppercase tracking-[0.2em] block mb-3"
                    style={{ color: 'var(--cream)', opacity: 0.6 }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b py-3 outline-none transition-all duration-300 focus:border-[var(--gold)]"
                    style={{
                      borderColor: 'rgba(245, 240, 232, 0.2)',
                      color: 'var(--cream)'
                    }}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    className="text-xs uppercase tracking-[0.2em] block mb-3"
                    style={{ color: 'var(--cream)', opacity: 0.6 }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-transparent border-b py-3 outline-none transition-all duration-300 focus:border-[var(--gold)]"
                    style={{
                      borderColor: 'rgba(245, 240, 232, 0.2)',
                      color: 'var(--cream)'
                    }}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  className="text-xs uppercase tracking-[0.2em] block mb-3"
                  style={{ color: 'var(--cream)', opacity: 0.6 }}
                >
                  Tell us about your vision
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-transparent border-b py-3 outline-none transition-all duration-300 focus:border-[var(--gold)] resize-none"
                  style={{
                    borderColor: 'rgba(245, 240, 232, 0.2)',
                    color: 'var(--cream)'
                  }}
                  placeholder="Describe your project..."
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="group relative px-12 py-4 overflow-hidden transition-all duration-500"
                  style={{
                    background: 'var(--gold)',
                    color: 'var(--navy)'
                  }}
                >
                  <span className="relative z-10 text-sm uppercase tracking-[0.2em] font-medium">
                    Start a Conversation
                  </span>
                  <div
                    className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-0 -translate-x-full"
                    style={{ background: 'var(--amber)' }}
                  />
                </button>
              </div>
            </form>
          </div>

          {/* Floating Gold Rectangles */}
          <GoldRect className="top-1/4 left-[5%] animate-float-gold opacity-20" size="md" delay={0.5} />
          <GoldRect className="bottom-1/4 right-[8%] animate-float-gold opacity-30" size="sm" delay={1.5} />
        </section>

        {/* ==================== FOOTER ==================== */}
        <footer
          className="relative py-16 px-6 border-t"
          style={{
            background: '#0a1420',
            borderColor: 'rgba(245, 240, 232, 0.1)'
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
                  The <span className="italic">Twenty One</span>
                </span>
              </div>

              {/* Links */}
              <div className="flex gap-8">
                {['Instagram', 'Behance', 'Dribbble'].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[var(--gold)]"
                    style={{ color: 'var(--cream)', opacity: 0.6 }}
                  >
                    {link}
                  </a>
                ))}
              </div>

              {/* Copyright */}
              <p
                className="text-xs"
                style={{ color: 'var(--cream)', opacity: 0.4 }}
              >
                &copy; 2024 The Twenty One. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
