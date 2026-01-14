'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../components/LanguageProvider';
import {
  PaintSplatter,
  GoldRect,
  GrainOverlay,
  ArtisticFooter,
  artisticStyles,
} from '@/components/ui/ArtisticElements';

export default function PricingPage() {
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const products = [
    {
      id: 'free-pdf',
      name: 'Free PDF Guide',
      subtitle: 'Lead Magnet',
      price: 0,
      originalPrice: null,
      description: 'Start your healing journey with our introductory guide to attachment theory.',
      features: [
        'Introduction to attachment styles',
        'Basic self-assessment questions',
        'Understanding anxious attachment',
        'First steps to healing',
      ],
      cta: 'Download Free',
      href: '/quiz',
      featured: false,
      badge: null,
    },
    {
      id: '21-day-protocol',
      name: '21-Day Protocol',
      subtitle: 'Main Healing Program',
      price: 27,
      originalPrice: 67,
      description: 'The complete 21-day healing protocol to transform your attachment patterns.',
      features: [
        'Complete 21-day healing protocol',
        'Daily exercises & reflections',
        'Audio meditations included',
        'Nervous system regulation techniques',
        'Relationship communication scripts',
        'Lifetime access to all materials',
      ],
      cta: 'Get the Protocol',
      href: '/checkout?product=21-day-protocol',
      featured: true,
      badge: 'Most Popular',
    },
    {
      id: 'premium-pdf',
      name: 'Premium PDF Guide',
      subtitle: 'Comprehensive Guide',
      price: 9,
      originalPrice: null,
      description: 'An in-depth guide to understanding and healing anxious attachment.',
      features: [
        'Complete attachment theory overview',
        'Deep-dive into anxious patterns',
        'Detailed healing exercises',
        'Journaling prompts & worksheets',
        'Printable resources',
      ],
      cta: 'Get the Guide',
      href: '/checkout?product=premium-pdf',
      featured: false,
      badge: null,
    },
  ];

  return (
    <>
      <style jsx global>{artisticStyles}</style>

      <div className="artistic-page min-h-screen" style={{ background: 'var(--cream)' }}>
        <GrainOverlay />

        {/* Background Decorations */}
        <PaintSplatter
          className="w-[400px] h-[400px] -top-20 -right-32 opacity-10"
          color="var(--blue)"
          delay={200}
          scale={0.8}
        />
        <PaintSplatter
          className="w-[300px] h-[300px] bottom-1/4 -left-20 opacity-10"
          color="var(--navy)"
          delay={400}
          scale={0.6}
        />

        <GoldRect className="top-[20%] right-[5%] opacity-40" size="md" delay={0.5} />
        <GoldRect className="bottom-[30%] left-[8%] opacity-30" size="sm" delay={1} />

        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span
              className={`text-xs uppercase tracking-[0.4em] block mb-4 ${mounted ? 'reveal-up' : 'opacity-0'}`}
              style={{ color: 'var(--gold)', animationDelay: '0.1s' }}
            >
              Our Products
            </span>

            <h1
              className={`heading-serif text-4xl md:text-5xl lg:text-6xl font-light mb-6 ${mounted ? 'reveal-up' : 'opacity-0'}`}
              style={{ color: 'var(--navy)', lineHeight: 1.1, animationDelay: '0.2s' }}
            >
              Transform Your{' '}
              <span className="italic" style={{ color: 'var(--blue)' }}>
                Attachment Style
              </span>
            </h1>

            <p
              className={`text-lg max-w-2xl mx-auto mb-12 ${mounted ? 'reveal-up' : 'opacity-0'}`}
              style={{ color: 'var(--navy)', opacity: 0.6, animationDelay: '0.3s' }}
            >
              Choose the right resource for your healing journey. From free guides to our comprehensive 21-day protocol.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="relative pb-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={`p-8 relative flex flex-col ${mounted ? 'reveal-up' : 'opacity-0'}`}
                  style={{
                    background: product.featured ? 'var(--navy)' : 'var(--white)',
                    border: product.featured ? 'none' : '1px solid rgba(129, 53, 46, 0.1)',
                    animationDelay: `${0.4 + index * 0.1}s`,
                  }}
                >
                  {/* Badge */}
                  {product.badge && (
                    <div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 text-xs uppercase tracking-[0.15em] font-medium"
                      style={{ background: 'var(--gold)', color: 'var(--navy)' }}
                    >
                      {product.badge}
                    </div>
                  )}

                  <div className="mb-6">
                    <span
                      className="text-xs uppercase tracking-[0.3em] block mb-3"
                      style={{ color: 'var(--gold)' }}
                    >
                      {product.subtitle}
                    </span>
                    <h2
                      className="heading-serif text-2xl font-light mb-3"
                      style={{ color: product.featured ? 'var(--cream)' : 'var(--navy)' }}
                    >
                      {product.name}
                    </h2>
                    <div className="flex items-baseline gap-3">
                      <span
                        className="heading-serif text-4xl font-light"
                        style={{ color: product.featured ? 'var(--cream)' : 'var(--navy)' }}
                      >
                        {product.price === 0 ? 'Free' : `€${product.price}`}
                      </span>
                      {product.originalPrice && (
                        <span
                          className="text-lg line-through"
                          style={{
                            color: product.featured ? 'var(--cream)' : 'var(--navy)',
                            opacity: 0.4
                          }}
                        >
                          €{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <p
                      className="mt-4 text-sm"
                      style={{
                        color: product.featured ? 'var(--cream)' : 'var(--navy)',
                        opacity: 0.6
                      }}
                    >
                      {product.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className="mt-2 w-1.5 h-1.5 flex-shrink-0"
                          style={{ background: 'var(--gold)' }}
                        />
                        <span
                          style={{
                            color: product.featured ? 'var(--cream)' : 'var(--navy)',
                            opacity: product.featured ? 0.8 : 0.7
                          }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={product.href}
                    className={`block w-full py-4 text-center text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 ${
                      product.featured
                        ? 'group relative overflow-hidden'
                        : 'hover:bg-[var(--navy)] hover:text-[var(--cream)]'
                    }`}
                    style={
                      product.featured
                        ? { background: 'var(--gold)', color: 'var(--navy)' }
                        : { border: '1px solid var(--navy)', color: 'var(--navy)' }
                    }
                  >
                    {product.featured ? (
                      <>
                        <span className="relative z-10">{product.cta}</span>
                        <div
                          className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-0 -translate-x-full"
                          style={{ background: 'var(--amber)' }}
                        />
                      </>
                    ) : (
                      product.cta
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantee Section */}
        <section className="py-24 px-6" style={{ background: 'var(--white)' }}>
          <div className="max-w-3xl mx-auto">
            <div
              className="p-12 text-center relative"
              style={{
                background: 'var(--cream)',
                border: '1px solid rgba(129, 53, 46, 0.1)',
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: 'linear-gradient(90deg, var(--navy), var(--blue), var(--gold))' }}
              />

              <span
                className="text-xs uppercase tracking-[0.4em] block mb-4"
                style={{ color: 'var(--gold)' }}
              >
                Our Promise
              </span>
              <h2
                className="heading-serif text-2xl md:text-3xl font-light mb-6"
                style={{ color: 'var(--navy)' }}
              >
                30-Day Money Back Guarantee
              </h2>
              <p
                className="max-w-xl mx-auto mb-8"
                style={{ color: 'var(--navy)', opacity: 0.6, lineHeight: 1.8 }}
              >
                We believe in the power of our protocol. If you don't see results within 30 days,
                we'll refund your purchase—no questions asked.
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                {[
                  'Instant digital delivery',
                  'Lifetime access',
                  'Full refund if not satisfied',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className="w-2 h-2"
                      style={{ background: 'var(--gold)' }}
                    />
                    <span className="text-sm" style={{ color: 'var(--navy)', opacity: 0.7 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section
          className="py-24 px-6"
          style={{ background: 'linear-gradient(135deg, var(--blue) 0%, var(--navy) 100%)' }}
        >
          <PaintSplatter
            className="w-[300px] h-[300px] -top-20 -left-20 opacity-10"
            color="var(--light-blue)"
            delay={0}
            scale={0.6}
          />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <span
              className="text-xs uppercase tracking-[0.4em] block mb-4"
              style={{ color: 'var(--gold)' }}
            >
              Start Today
            </span>
            <h2
              className="heading-serif text-3xl md:text-4xl lg:text-5xl font-light mb-6"
              style={{ color: 'var(--cream)' }}
            >
              Ready to Begin Your{' '}
              <span className="italic" style={{ color: 'var(--light-blue)' }}>
                Healing?
              </span>
            </h2>
            <p className="mb-10" style={{ color: 'var(--cream)', opacity: 0.6 }}>
              Take the first step towards secure attachment with our 21-Day Protocol.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/checkout?product=21-day-protocol"
                className="group relative px-10 py-4 text-xs uppercase tracking-[0.15em] font-medium overflow-hidden transition-all duration-500"
                style={{ background: 'var(--gold)', color: 'var(--navy)' }}
              >
                <span className="relative z-10">Get the 21-Day Protocol — €27</span>
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-0 -translate-x-full"
                  style={{ background: 'var(--amber)' }}
                />
              </Link>
              <Link
                href="/quiz"
                className="px-10 py-4 text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 hover:bg-[var(--cream)] hover:text-[var(--navy)]"
                style={{
                  border: '1px solid var(--cream)',
                  color: 'var(--cream)',
                }}
              >
                Start with Free Guide
              </Link>
            </div>
          </div>

          <GoldRect className="bottom-16 right-[10%] opacity-30" size="sm" delay={0.5} />
        </section>

        <ArtisticFooter />
      </div>
    </>
  );
}
