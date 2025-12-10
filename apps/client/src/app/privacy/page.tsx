'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <header className="border-b border-warm-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/" className="font-serif text-2xl text-matcha-600">
            Matcha
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif text-4xl text-warm-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-warm max-w-none space-y-6 text-warm-700">
          <p className="text-sm text-warm-500">Last updated: December 2024</p>

          <section>
            <h2 className="font-serif text-2xl text-warm-900 mt-8 mb-4">1. Introduction</h2>
            <p>
              At Matcha, we take your privacy seriously. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our AI wellness companion service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-warm-900 mt-8 mb-4">2. Information We Collect</h2>

            <h3 className="font-semibold text-lg text-warm-800 mt-6 mb-2">Personal Information</h3>
            <p>When you create an account, we may collect:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Email address</li>
              <li>Name (if provided)</li>
              <li>Profile information</li>
              <li>Payment information (processed securely by our payment provider)</li>
            </ul>

            <h3 className="font-semibold text-lg text-warm-800 mt-6 mb-2">Conversation Data</h3>
            <p>
              To provide our service, we store your conversations with Matcha. This data is used to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Provide personalized insights and analysis</li>
              <li>Track your progress over time</li>
              <li>Improve the quality of our AI responses</li>
            </ul>

            <h3 className="font-semibold text-lg text-warm-800 mt-6 mb-2">Usage Data</h3>
            <p>
              We automatically collect certain information about your device and how you interact with
              our Service, including IP address, browser type, pages visited, and time spent on pages.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-warm-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-warm-900 mt-8 mb-4">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your
              personal information, including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure cloud infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-warm-900 mt-8 mb-4">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to
              provide you services. You can request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-warm-900 mt-8 mb-4">6. Third-Party Services</h2>
            <p>We use trusted third-party services to operate our platform:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Authentication:</strong> Clerk (secure user authentication)</li>
              <li><strong>Payments:</strong> Stripe (payment processing)</li>
              <li><strong>AI Processing:</strong> OpenRouter/Anthropic (conversation AI)</li>
              <li><strong>Hosting:</strong> Render, Vercel (cloud infrastructure)</li>
            </ul>
            <p className="mt-4">
              These providers have their own privacy policies and are contractually obligated to protect
              your information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-warm-900 mt-8 mb-4">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-warm-900 mt-8 mb-4">8. Children's Privacy</h2>
            <p>
              Our Service is not intended for children under 13 years of age. We do not knowingly collect
              personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-warm-900 mt-8 mb-4">9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place to protect your information in accordance
              with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-warm-900 mt-8 mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-warm-900 mt-8 mb-4">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at{' '}
              <a href="mailto:privacy@matcha.ai" className="text-matcha-600 hover:underline">
                privacy@matcha.ai
              </a>
            </p>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-warm-200">
          <Link href="/" className="text-matcha-600 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
