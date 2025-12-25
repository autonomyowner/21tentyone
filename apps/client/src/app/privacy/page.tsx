'use client';

import Link from 'next/link';
import { GoldRect, GrainOverlay, artisticStyles, ArtisticFooter } from '@/components/ui/ArtisticElements';

export default function PrivacyPage() {
  return (
    <>
      <style jsx global>{artisticStyles}</style>
      <div
        className="artistic-page min-h-screen"
        style={{
          background: 'var(--cream)',
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, rgba(45, 90, 138, 0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(107, 156, 196, 0.03) 0%, transparent 50%)
          `,
        }}
      >
        <GrainOverlay />
        <GoldRect className="top-[20%] right-[5%] opacity-20" size="sm" delay={0} />
        <GoldRect className="bottom-[40%] left-[3%] opacity-15" size="md" delay={0.5} />

        {/* Header */}
        <header
          className="sticky top-0 z-50 transition-all duration-500"
          style={{
            background: 'rgba(245, 240, 232, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(26, 46, 74, 0.08)',
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
            Privacy <span className="italic" style={{ color: 'var(--blue)' }}>Policy</span>
          </h1>
          <div
            className="w-16 h-px mb-8"
            style={{ background: 'var(--gold)' }}
          />

          <div className="space-y-8" style={{ color: 'var(--navy)' }}>
            <p className="text-sm" style={{ opacity: 0.5 }}>Last updated: December 2024</p>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                1. Introduction
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                At 21|Twenty One, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our wellness companion service.
              </p>
            </section>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                2. Information We Collect
              </h2>

              <h3 className="font-medium text-lg mt-6 mb-3" style={{ color: 'var(--blue)' }}>Personal Information</h3>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>When you create an account, we may collect:</p>
              <ul className="list-none mt-4 space-y-2" style={{ opacity: 0.7 }}>
                {['Email address', 'Name (if provided)', 'Profile information', 'Payment information (processed securely by our payment provider)'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5" style={{ background: 'var(--gold)' }} />
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="font-medium text-lg mt-8 mb-3" style={{ color: 'var(--blue)' }}>Conversation Data</h3>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                To provide our service, we store your conversations. This data is used to:
              </p>
              <ul className="list-none mt-4 space-y-2" style={{ opacity: 0.7 }}>
                {['Provide personalized insights and analysis', 'Track your progress over time', 'Improve the quality of our responses'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5" style={{ background: 'var(--gold)' }} />
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="font-medium text-lg mt-8 mb-3" style={{ color: 'var(--blue)' }}>Usage Data</h3>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                We automatically collect certain information about your device and how you interact with
                our Service, including IP address, browser type, pages visited, and time spent on pages.
              </p>
            </section>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                3. How We Use Your Information
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>We use the information we collect to:</p>
              <ul className="list-none mt-4 space-y-2" style={{ opacity: 0.7 }}>
                {[
                  'Provide, maintain, and improve our Service',
                  'Process transactions and send related information',
                  'Send you technical notices and support messages',
                  'Respond to your comments and questions',
                  'Analyze usage patterns to improve user experience',
                  'Protect against fraudulent or illegal activity'
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
                4. Data Security
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                We implement appropriate technical and organizational security measures to protect your
                personal information, including:
              </p>
              <ul className="list-none mt-4 space-y-2" style={{ opacity: 0.7 }}>
                {[
                  'Encryption of data in transit and at rest',
                  'Regular security assessments',
                  'Access controls and authentication',
                  'Secure cloud infrastructure'
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
                5. Data Retention
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                We retain your personal information for as long as your account is active or as needed to
                provide you services. You can request deletion of your data at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                6. Third-Party Services
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>We use trusted third-party services to operate our platform:</p>
              <ul className="list-none mt-4 space-y-2" style={{ opacity: 0.7 }}>
                {[
                  'Authentication: Clerk (secure user authentication)',
                  'Payments: Stripe (payment processing)',
                  'AI Processing: Anthropic (conversation AI)',
                  'Hosting: Render, Vercel (cloud infrastructure)'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5" style={{ background: 'var(--gold)' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4" style={{ opacity: 0.7, lineHeight: 1.8 }}>
                These providers have their own privacy policies and are contractually obligated to protect
                your information.
              </p>
            </section>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                7. Your Rights
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>You have the right to:</p>
              <ul className="list-none mt-4 space-y-2" style={{ opacity: 0.7 }}>
                {[
                  'Access your personal data',
                  'Correct inaccurate data',
                  'Request deletion of your data',
                  'Export your data in a portable format',
                  'Opt out of marketing communications',
                  'Withdraw consent at any time'
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
                8. Children&apos;s Privacy
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                Our Service is not intended for children under 13 years of age. We do not knowingly collect
                personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                9. International Data Transfers
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                Your information may be transferred to and processed in countries other than your own.
                We ensure appropriate safeguards are in place to protect your information in accordance
                with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                10. Changes to This Policy
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                We may update this Privacy Policy from time to time. We will notify you of any changes by
                posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="heading-serif text-2xl font-light mt-12 mb-4" style={{ color: 'var(--navy)' }}>
                11. Contact Us
              </h2>
              <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                If you have any questions about this Privacy Policy or our data practices, please contact us at{' '}
                <a
                  href="mailto:privacy@21twentyone.com"
                  className="transition-colors duration-300"
                  style={{ color: 'var(--gold)' }}
                >
                  privacy@21twentyone.com
                </a>
              </p>
            </section>
          </div>

          {/* Back link */}
          <div className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(26, 46, 74, 0.1)' }}>
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
