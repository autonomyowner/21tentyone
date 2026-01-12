'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import ArtisticT21 from './ui/ArtisticT21';

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const navItems = [
    { label: 'Journey', href: '/dashboard' },
    { label: 'Assessment', href: '/assessment' },
    { label: 'Blog', href: '/blog' },
    { label: 'Pricing', href: '/pricing' },
  ];

  return (
    <>
      {/* Fonts loaded via Next.js optimization in layout.tsx */}
      <style jsx global>{`
        .header-artistic {
          --navy: #81352E;
          --blue: #9D433A;
          --gold: #BA5448;
          --cream: #FBE9E7;
          --white: #ffffff;
        }

        .header-artistic .heading-serif {
          font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
        }
      `}</style>

      <header
        className="header-artistic fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(129, 53, 46, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20 py-6">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-normal transition-colors duration-300 flex items-center"
            >
              <ArtisticT21 scrolled={scrolled} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:opacity-100 relative group"
                  style={{
                    color: scrolled ? 'var(--cream)' : 'var(--navy)',
                    opacity: 0.7,
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 400,
                  }}
                >
                  {item.label}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                    style={{ background: 'var(--gold)' }}
                  />
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="text-xs uppercase tracking-[0.15em] transition-all duration-300 hover:opacity-100"
                style={{
                  color: scrolled ? 'var(--cream)' : 'var(--navy)',
                  opacity: 0.6,
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                {language === 'en' ? 'FR' : 'EN'}
              </button>

              <Link
                href="/dashboard"
                className="group relative px-6 py-2.5 overflow-hidden transition-all duration-500"
                style={{
                  background: scrolled ? 'var(--gold)' : 'var(--navy)',
                  color: scrolled ? 'var(--navy)' : 'var(--cream)',
                }}
              >
                <span
                  className="relative z-10 text-xs uppercase tracking-[0.15em]"
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
                >
                  Start Healing
                </span>
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-0 -translate-x-full"
                  style={{ background: scrolled ? '#C1918C' : 'var(--blue)' }}
                />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Menu"
            >
              <span
                className="w-6 h-px transition-all duration-300"
                style={{
                  background: scrolled ? 'var(--cream)' : 'var(--navy)',
                  transform: mobileMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
                }}
              />
              <span
                className="w-6 h-px transition-all duration-300"
                style={{
                  background: scrolled ? 'var(--cream)' : 'var(--navy)',
                  opacity: mobileMenuOpen ? 0 : 1,
                }}
              />
              <span
                className="w-6 h-px transition-all duration-300"
                style={{
                  background: scrolled ? 'var(--cream)' : 'var(--navy)',
                  transform: mobileMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-500"
        style={{
          background: 'var(--navy)',
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
        }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          {navItems.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className="heading-serif text-3xl transition-all duration-500"
              style={{
                color: 'var(--cream)',
                transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: mobileMenuOpen ? 1 : 0,
                transitionDelay: `${i * 80}ms`,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="mt-4 text-xs uppercase tracking-[0.2em] transition-all duration-500"
            style={{
              color: 'var(--gold)',
              transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: mobileMenuOpen ? 1 : 0,
              transitionDelay: `${navItems.length * 80}ms`,
            }}
          >
            {language === 'en' ? 'Switch to French' : 'Passer en anglais'}
          </button>

          {/* Mobile CTA */}
          <Link
            href="/dashboard"
            className="mt-6 px-10 py-4 transition-all duration-500"
            style={{
              background: 'var(--gold)',
              color: 'var(--navy)',
              transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: mobileMenuOpen ? 1 : 0,
              transitionDelay: `${(navItems.length + 1) * 80}ms`,
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span
              className="text-xs uppercase tracking-[0.2em]"
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
            >
              Start Healing
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
