'use client';

import { useEffect, useState } from 'react';

// Shared CSS Variables and Styles
export const artisticStyles = `
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

  .artistic-page {
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
    from { opacity: 0; transform: translateY(60px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .reveal-up {
    animation: reveal-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes paint-expand {
    from { transform: scale(0) rotate(-10deg); opacity: 0; }
    to { transform: scale(1) rotate(0deg); opacity: 1; }
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

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  /* Hide scrollbar for timeline */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// Paint Splatter SVG Component
export const PaintSplatter = ({
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
export const GoldRect = ({
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
        background: 'linear-gradient(135deg, #BA5448 0%, #C1918C 50%, #BA5448 100%)',
        animationDelay: `${delay}s`,
        boxShadow: '0 8px 32px rgba(186, 84, 72, 0.3)'
      }}
    />
  );
};

// Grain Overlay
export const GrainOverlay = () => (
  <div
    className="fixed inset-0 pointer-events-none z-50 opacity-[0.06]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

// Page Wrapper with artistic background
export const ArtisticPageWrapper = ({
  children,
  className = '',
  showGrain = true,
}: {
  children: React.ReactNode;
  className?: string;
  showGrain?: boolean;
}) => {
  return (
    <>
      <style jsx global>{artisticStyles}</style>
      <div className={`artistic-page min-h-screen ${className}`}>
        {showGrain && <GrainOverlay />}
        {children}
      </div>
    </>
  );
};

// Section Header Component
export const SectionHeader = ({
  eyebrow,
  title,
  titleHighlight,
  description,
  centered = true,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
}) => {
  return (
    <div className={`${centered ? 'text-center' : ''} mb-16 md:mb-20`}>
      {eyebrow && (
        <span
          className="text-xs uppercase tracking-[0.4em] block mb-4"
          style={{ color: 'var(--gold)' }}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className="heading-serif text-4xl md:text-5xl lg:text-6xl font-light"
        style={{
          color: light ? 'var(--cream)' : 'var(--navy)',
          lineHeight: 1.1
        }}
      >
        {title}{' '}
        {titleHighlight && (
          <span className="italic" style={{ color: light ? 'var(--light-blue)' : 'var(--blue)' }}>
            {titleHighlight}
          </span>
        )}
      </h2>
      {description && (
        <p
          className={`text-lg mt-6 ${centered ? 'max-w-xl mx-auto' : ''}`}
          style={{ color: light ? 'var(--cream)' : 'var(--navy)', opacity: 0.6 }}
        >
          {description}
        </p>
      )}
      <div
        className={`w-16 h-px mt-8 ${centered ? 'mx-auto' : ''}`}
        style={{ background: 'var(--gold)' }}
      />
    </div>
  );
};

// Artistic Button
export const ArtisticButton = ({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'gold';
  className?: string;
}) => {
  const styles = {
    primary: {
      background: 'var(--navy)',
      color: 'var(--cream)',
      hoverBg: 'var(--blue)',
      border: undefined as string | undefined,
    },
    secondary: {
      background: 'transparent',
      color: 'var(--navy)',
      border: '1px solid var(--navy)',
      hoverBg: undefined as string | undefined,
    },
    gold: {
      background: 'var(--gold)',
      color: 'var(--navy)',
      hoverBg: 'var(--amber)',
      border: undefined as string | undefined,
    },
  };

  const style = styles[variant];

  const buttonContent = (
    <>
      <span className="relative z-10 text-sm uppercase tracking-[0.15em] font-medium">
        {children}
      </span>
      {style.hoverBg && (
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-0 -translate-x-full"
          style={{ background: style.hoverBg }}
        />
      )}
    </>
  );

  const baseClasses = `group relative px-10 py-4 overflow-hidden transition-all duration-500 ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        style={{
          background: style.background,
          color: style.color,
          border: style.border,
        }}
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={baseClasses}
      style={{
        background: style.background,
        color: style.color,
        border: style.border,
      }}
    >
      {buttonContent}
    </button>
  );
};

// Footer Component
export const ArtisticFooter = () => {
  return (
    <footer
      className="relative py-20 px-6"
      style={{
        background: 'linear-gradient(180deg, var(--navy) 0%, #5A231F 100%)'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <h3
            className="heading-serif text-4xl md:text-5xl font-light mb-6"
            style={{ color: 'var(--cream)' }}
          >
            21<span className="italic">|Twenty One</span>
          </h3>

          <div className="w-16 h-px mb-8" style={{ background: 'var(--gold)' }} />

          <p
            className="max-w-md mb-12"
            style={{ color: 'var(--cream)', opacity: 0.5 }}
          >
            Heal your attachment. Build healthy relationships.
            Your 21-day journey to emotional freedom.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
              { label: 'Pricing', href: '/pricing' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[var(--gold)]"
                style={{ color: 'var(--cream)', opacity: 0.6 }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="mailto:support@thetwenyone.com"
            className="text-sm mb-12 transition-colors duration-300 hover:text-[var(--gold)]"
            style={{ color: 'var(--cream)', opacity: 0.7 }}
          >
            support@thetwenyone.com
          </a>

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
  );
};
