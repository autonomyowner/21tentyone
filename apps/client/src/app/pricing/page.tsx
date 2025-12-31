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
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [mounted, setMounted] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currency = language === 'en' ? '$' : '€';
  const monthlyPrice = '15';
  const yearlyPrice = '12';
  const yearlyTotal = '144';
  const yearlySavings = '36';

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
              Pricing
            </span>

            <h1
              className={`heading-serif text-4xl md:text-5xl lg:text-6xl font-light mb-6 ${mounted ? 'reveal-up' : 'opacity-0'}`}
              style={{ color: 'var(--navy)', lineHeight: 1.1, animationDelay: '0.2s' }}
            >
              {t.pricing.title.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="italic" style={{ color: 'var(--blue)' }}>
                {t.pricing.title.split(' ').slice(-1)[0]}
              </span>
            </h1>

            <p
              className={`text-lg max-w-2xl mx-auto mb-12 ${mounted ? 'reveal-up' : 'opacity-0'}`}
              style={{ color: 'var(--navy)', opacity: 0.6, animationDelay: '0.3s' }}
            >
              {t.pricing.subtitle}
            </p>

            {/* Billing Toggle */}
            <div
              className={`inline-flex items-center gap-1 p-1 ${mounted ? 'reveal-up' : 'opacity-0'}`}
              style={{
                background: 'var(--white)',
                border: '1px solid rgba(129, 53, 46, 0.1)',
                animationDelay: '0.4s'
              }}
            >
              <button
                onClick={() => setBillingPeriod('monthly')}
                className="px-6 py-3 text-xs uppercase tracking-[0.15em] font-medium transition-all"
                style={{
                  background: billingPeriod === 'monthly' ? 'var(--navy)' : 'transparent',
                  color: billingPeriod === 'monthly' ? 'var(--cream)' : 'var(--navy)',
                }}
              >
                {t.pricing.monthly}
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className="px-6 py-3 text-xs uppercase tracking-[0.15em] font-medium transition-all relative"
                style={{
                  background: billingPeriod === 'yearly' ? 'var(--navy)' : 'transparent',
                  color: billingPeriod === 'yearly' ? 'var(--cream)' : 'var(--navy)',
                }}
              >
                {t.pricing.yearly}
                <span
                  className="absolute -top-3 -right-3 px-2 py-1 text-[10px] font-medium"
                  style={{ background: 'var(--gold)', color: 'var(--navy)' }}
                >
                  -20%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="relative pb-32 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div
                className={`p-10 relative ${mounted ? 'reveal-up' : 'opacity-0'}`}
                style={{
                  background: 'var(--white)',
                  border: '1px solid rgba(129, 53, 46, 0.1)',
                  animationDelay: '0.5s'
                }}
              >
                <div className="mb-8">
                  <span
                    className="text-xs uppercase tracking-[0.3em] block mb-4"
                    style={{ color: 'var(--gold)' }}
                  >
                    {t.pricing.free}
                  </span>
                  <h2
                    className="heading-serif text-2xl font-light mb-3"
                    style={{ color: 'var(--navy)' }}
                  >
                    {t.pricing.discovery}
                  </h2>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="heading-serif text-5xl font-light"
                      style={{ color: 'var(--navy)' }}
                    >
                      0{currency}
                    </span>
                    <span style={{ color: 'var(--navy)', opacity: 0.4 }}>
                      {t.pricing.perMonth}
                    </span>
                  </div>
                  <p
                    className="mt-4 text-sm"
                    style={{ color: 'var(--navy)', opacity: 0.6 }}
                  >
                    {t.pricing.freeDesc}
                  </p>
                </div>

                <ul className="space-y-4 mb-10">
                  {[
                    t.pricing.freeFeature1,
                    t.pricing.freeFeature2,
                    t.pricing.freeFeature3,
                    t.pricing.freeFeature4,
                    t.pricing.freeFeature5,
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="mt-2 w-1.5 h-1.5 flex-shrink-0"
                        style={{ background: 'var(--gold)' }}
                      />
                      <span style={{ color: 'var(--navy)', opacity: 0.7 }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup?plan=gratuit"
                  className="block w-full py-4 text-center text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 hover:bg-[var(--navy)] hover:text-[var(--cream)]"
                  style={{
                    border: '1px solid var(--navy)',
                    color: 'var(--navy)',
                  }}
                >
                  {t.pricing.startFree}
                </Link>
              </div>

              {/* Pro Plan */}
              <div
                className={`p-10 relative ${mounted ? 'reveal-up' : 'opacity-0'}`}
                style={{
                  background: 'var(--navy)',
                  animationDelay: '0.6s'
                }}
              >
                {/* Popular badge */}
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 text-xs uppercase tracking-[0.15em] font-medium"
                  style={{ background: 'var(--gold)', color: 'var(--navy)' }}
                >
                  {t.pricing.mostPopular}
                </div>

                <div className="mb-8">
                  <span
                    className="text-xs uppercase tracking-[0.3em] block mb-4"
                    style={{ color: 'var(--gold)' }}
                  >
                    {t.pricing.pro}
                  </span>
                  <h2
                    className="heading-serif text-2xl font-light mb-3"
                    style={{ color: 'var(--cream)' }}
                  >
                    {t.pricing.transformation}
                  </h2>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="heading-serif text-5xl font-light"
                      style={{ color: 'var(--cream)' }}
                    >
                      {billingPeriod === 'monthly' ? monthlyPrice : yearlyPrice}{currency}
                    </span>
                    <span style={{ color: 'var(--cream)', opacity: 0.5 }}>
                      {t.pricing.perMonth}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-sm mt-2" style={{ color: 'var(--cream)', opacity: 0.5 }}>
                      {t.pricing.billedYearly.replace('{amount}', yearlyTotal + currency).replace('{savings}', yearlySavings + currency)}
                    </p>
                  )}
                  <p
                    className="mt-4 text-sm"
                    style={{ color: 'var(--cream)', opacity: 0.6 }}
                  >
                    {t.pricing.proDesc}
                  </p>
                </div>

                <ul className="space-y-4 mb-10">
                  {[
                    t.pricing.proFeature1,
                    t.pricing.proFeature2,
                    t.pricing.proFeature3,
                    t.pricing.proFeature4,
                    t.pricing.proFeature5,
                    t.pricing.proFeature6,
                    t.pricing.proFeature7,
                    t.pricing.proFeature8,
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="mt-2 w-1.5 h-1.5 flex-shrink-0"
                        style={{ background: 'var(--gold)' }}
                      />
                      <span style={{ color: 'var(--cream)', opacity: 0.8 }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/checkout?plan=pro&billing=${billingPeriod}`}
                  className="group block w-full py-4 text-center text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 relative overflow-hidden"
                  style={{ background: 'var(--gold)', color: 'var(--navy)' }}
                >
                  <span className="relative z-10">{t.pricing.tryPro}</span>
                  <div
                    className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-0 -translate-x-full"
                    style={{ background: 'var(--amber)' }}
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-24 px-6" style={{ background: 'var(--white)' }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span
                className="text-xs uppercase tracking-[0.4em] block mb-4"
                style={{ color: 'var(--gold)' }}
              >
                Compare
              </span>
              <h2
                className="heading-serif text-3xl md:text-4xl font-light"
                style={{ color: 'var(--navy)' }}
              >
                {t.pricing.compareTitle}
              </h2>
              <div className="w-16 h-px mx-auto mt-6" style={{ background: 'var(--gold)' }} />
            </div>

            <div style={{ border: '1px solid rgba(129, 53, 46, 0.1)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(129, 53, 46, 0.1)' }}>
                    <th
                      className="text-left py-5 px-6 text-xs uppercase tracking-[0.15em] font-medium"
                      style={{ color: 'var(--navy)', opacity: 0.5 }}
                    >
                      {t.pricing.feature}
                    </th>
                    <th
                      className="text-center py-5 px-6 text-xs uppercase tracking-[0.15em] font-medium"
                      style={{ color: 'var(--navy)', opacity: 0.5 }}
                    >
                      {t.pricing.free}
                    </th>
                    <th
                      className="text-center py-5 px-6 text-xs uppercase tracking-[0.15em] font-medium"
                      style={{ color: 'var(--gold)' }}
                    >
                      {t.pricing.pro}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: t.pricing.analysesPerMonth, free: '3', pro: t.pricing.unlimited },
                    { feature: t.pricing.psychProfile, free: t.pricing.basic, pro: t.pricing.complete },
                    { feature: t.pricing.biasesDetected, free: t.pricing.mainOnly, pro: t.pricing.all20Plus },
                    { feature: t.pricing.progressTracking, free: t.pricing.no, pro: t.pricing.yes },
                    { feature: t.pricing.personalizedReports, free: t.pricing.no, pro: t.pricing.weekly },
                    { feature: t.pricing.deepAIChat, free: t.pricing.no, pro: t.pricing.yes },
                    { feature: t.pricing.pdfExport, free: t.pricing.yes, pro: t.pricing.yes },
                    { feature: t.pricing.support, free: t.pricing.community, pro: t.pricing.priority },
                  ].map((row, i, arr) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: i < arr.length - 1 ? '1px solid rgba(129, 53, 46, 0.05)' : 'none',
                      }}
                    >
                      <td className="py-4 px-6" style={{ color: 'var(--navy)' }}>
                        {row.feature}
                      </td>
                      <td
                        className="text-center py-4 px-6"
                        style={{ color: 'var(--navy)', opacity: 0.5 }}
                      >
                        {row.free}
                      </td>
                      <td
                        className="text-center py-4 px-6 font-medium"
                        style={{ color: 'var(--gold)' }}
                      >
                        {row.pro}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Guarantee Section */}
        <section className="py-24 px-6" style={{ background: 'var(--cream)' }}>
          <div className="max-w-3xl mx-auto">
            <div
              className="p-12 text-center relative"
              style={{
                background: 'var(--white)',
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
                {t.pricing.guaranteeTitle}
              </h2>
              <p
                className="max-w-xl mx-auto mb-8"
                style={{ color: 'var(--navy)', opacity: 0.6, lineHeight: 1.8 }}
              >
                {t.pricing.guaranteeDesc}
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                {[
                  t.pricing.cancelAnytime,
                  t.pricing.noCommitment,
                  t.pricing.immediateRefund,
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

        {/* FAQ Section */}
        <section className="py-24 px-6" style={{ background: 'var(--white)' }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span
                className="text-xs uppercase tracking-[0.4em] block mb-4"
                style={{ color: 'var(--gold)' }}
              >
                Questions
              </span>
              <h2
                className="heading-serif text-3xl md:text-4xl font-light"
                style={{ color: 'var(--navy)' }}
              >
                {t.pricing.faqTitle}
              </h2>
              <div className="w-16 h-px mx-auto mt-6" style={{ background: 'var(--gold)' }} />
            </div>

            <div className="space-y-4">
              {[
                { q: t.pricing.faq1Q, a: t.pricing.faq1A },
                { q: t.pricing.faq2Q, a: t.pricing.faq2A },
                { q: t.pricing.faq3Q, a: t.pricing.faq3A },
                { q: t.pricing.faq4Q, a: t.pricing.faq4A },
                { q: t.pricing.faq5Q, a: t.pricing.faq5A },
              ].map((faq, i) => (
                <details
                  key={i}
                  className="group"
                  style={{ border: '1px solid rgba(129, 53, 46, 0.1)' }}
                >
                  <summary
                    className="cursor-pointer px-6 py-5 font-medium flex items-center justify-between transition-all duration-300 hover:bg-[rgba(26,46,74,0.02)]"
                    style={{ color: 'var(--navy)' }}
                  >
                    {faq.q}
                    <span
                      className="ml-4 transition-transform duration-300 group-open:rotate-45 text-lg"
                      style={{ color: 'var(--gold)' }}
                    >
                      +
                    </span>
                  </summary>
                  <div
                    className="px-6 pb-6"
                    style={{ color: 'var(--navy)', opacity: 0.6 }}
                  >
                    {faq.a}
                  </div>
                </details>
              ))}
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
              Get Started
            </span>
            <h2
              className="heading-serif text-3xl md:text-4xl lg:text-5xl font-light mb-6"
              style={{ color: 'var(--cream)' }}
            >
              {t.pricing.readyToTransform.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="italic" style={{ color: 'var(--light-blue)' }}>
                {t.pricing.readyToTransform.split(' ').slice(-1)[0]}
              </span>
            </h2>
            <p className="mb-10" style={{ color: 'var(--cream)', opacity: 0.6 }}>
              {t.pricing.joinThousands}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/signup"
                className="group relative px-10 py-4 text-xs uppercase tracking-[0.15em] font-medium overflow-hidden transition-all duration-500"
                style={{ background: 'var(--gold)', color: 'var(--navy)' }}
              >
                <span className="relative z-10">{t.pricing.startFree}</span>
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-0 -translate-x-full"
                  style={{ background: 'var(--amber)' }}
                />
              </Link>
              <Link
                href={`/checkout?plan=pro&billing=${billingPeriod}`}
                className="px-10 py-4 text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 hover:bg-[var(--cream)] hover:text-[var(--navy)]"
                style={{
                  border: '1px solid var(--cream)',
                  color: 'var(--cream)',
                }}
              >
                {t.pricing.tryPro}
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
