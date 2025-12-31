'use client';

import Link from 'next/link';
import { GoldRect, GrainOverlay, artisticStyles, ArtisticFooter } from '@/components/ui/ArtisticElements';

export default function TermsPage() {
  return (
    <>
      <style jsx global>{artisticStyles}</style>
      <div
        className="artistic-page min-h-screen"
        style={{
          background: 'var(--cream)',
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, rgba(157, 67, 58, 0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(230, 200, 195, 0.03) 0%, transparent 50%)
          `,
        }}
      >
        <GrainOverlay />
        <GoldRect className="top-[25%] right-[4%] opacity-20" size="sm" delay={0} />
        <GoldRect className="bottom-[35%] left-[4%] opacity-15" size="md" delay={0.5} />

        {/* Header */}
        <header
          className="sticky top-0 z-50 transition-all duration-500"
          style={{
            background: 'rgba(251, 233, 231, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(129, 53, 46, 0.08)',
          }}
        >
          <div className="max-w-4xl mx-auto px-6 py-5">
            <Link
              href="/"
              className="heading-serif text-2xl font-normal"
              style={{ color: 'var(--navy)' }}
            >
              21<span className="italic">|Twenty One</span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-6 py-16 relative z-10">
          <span
            className="text-xs uppercase tracking-[0.4em] block mb-4"
            style={{ color: 'var(--gold)' }}
          >
            Legal
          </span>
          <h1
            className="heading-serif text-4xl md:text-5xl font-light mb-4"
            style={{ color: 'var(--navy)' }}
          >
            Terms of <span className="italic" style={{ color: 'var(--blue)' }}>Service</span>
          </h1>
          <div
            className="w-16 h-px mb-8"
            style={{ background: 'var(--gold)' }}
          />

          <div className="space-y-8" style={{ color: 'var(--navy)' }}>
            <p className="text-sm" style={{ opacity: 0.5 }}>Last updated: December 2024</p>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                1. Acceptance of Terms
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                By accessing or using 21|Twenty One (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                2. Description of Service
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                21|Twenty One is a wellness platform that provides conversational support, attachment healing resources,
                and guided relaxation techniques. The Service is designed for personal growth and
                self-reflection purposes.
              </p>
              <div
                className="mt-6 p-6"
                style={{
                  background: 'rgba(186, 84, 72, 0.1)',
                  borderLeft: '2px solid var(--gold)',
                }}
              >
                <p style={{ opacity: 0.8 }}>
                  <strong style={{ color: 'var(--navy)' }}>Important:</strong> 21|Twenty One is not a substitute for professional mental health care.
                  If you are experiencing a mental health crisis, please contact a licensed healthcare provider
                  or emergency services immediately.
                </p>
              </div>
            </section>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                3. User Accounts
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                To use certain features of the Service, you must create an account. You are responsible for:
              </p>
              <ul className="list-none mt-4 space-y-2" style={{ opacity: 0.7 }}>
                {[
                  'Maintaining the confidentiality of your account credentials',
                  'All activities that occur under your account',
                  'Providing accurate and complete information',
                  'Notifying us immediately of any unauthorized use'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5" style={{ background: 'var(--gold)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                4. Acceptable Use
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>You agree not to:</p>
              <ul className="list-none mt-4 space-y-2" style={{ opacity: 0.7 }}>
                {[
                  'Use the Service for any illegal purpose',
                  'Attempt to gain unauthorized access to any part of the Service',
                  'Interfere with or disrupt the Service',
                  'Use the Service to harm or harass others',
                  'Reverse engineer or attempt to extract the source code'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5" style={{ background: 'var(--gold)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                5. Subscription and Payments
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                21|Twenty One offers both free and paid subscription plans. Paid subscriptions are billed in advance
                on a monthly or yearly basis. You may cancel your subscription at any time, and cancellation
                will take effect at the end of the current billing period.
              </p>
            </section>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                6. Intellectual Property
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                The Service and its original content, features, and functionality are owned by 21|Twenty One and are
                protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                7. Limitation of Liability
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                To the maximum extent permitted by law, 21|Twenty One shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred
                directly or indirectly.
              </p>
            </section>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                8. Changes to Terms
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                We reserve the right to modify these terms at any time. We will notify users of any material
                changes by posting the new Terms of Service on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                9. Contact Us
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                If you have any questions about these Terms of Service, please contact us at{' '}
                <a
                  href="mailto:support@21twentyone.com"
                  className="transition-colors duration-300"
                  style={{ color: 'var(--gold)' }}
                >
                  support@21twentyone.com
                </a>
              </p>
            </section>
          </div>

          {/* Back link */}
          <div className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(129, 53, 46, 0.1)' }}>
            <Link
              href="/"
              className="inline-block text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:opacity-100 relative group"
              style={{ color: 'var(--navy)', opacity: 0.6 }}
            >
              ← Back to Home
              <span
                className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                style={{ background: 'var(--gold)' }}
              />
            </Link>
          </div>
        </main>

        <ArtisticFooter />
      </div>
    </>
  );
}
