'use client';

import { lazy, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TestimonialCard, BonusItem, FeatureCard } from './StaticComponents';
import { PaintSplatter, GoldRect } from './Decorations';

// Loading skeleton for sections
function SectionSkeleton() {
  return (
    <div className="py-24 px-6 animate-pulse">
      <div className="max-w-5xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4" />
        <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-8" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Quiz CTA Section - Lead Capture
export function QuizCTASection() {
  return (
    <section
      className="relative py-16 md:py-20 px-6"
      style={{ background: 'var(--navy)' }}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="relative p-8 md:p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(186, 84, 72, 0.2)'
          }}
        >
          {/* Decorative corner */}
          <div
            className="absolute top-0 left-0 w-16 h-16"
            style={{
              borderTop: '2px solid var(--gold)',
              borderLeft: '2px solid var(--gold)',
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-16 h-16"
            style={{
              borderBottom: '2px solid var(--gold)',
              borderRight: '2px solid var(--gold)',
            }}
          />

          <span
            className="inline-block px-4 py-2 text-xs uppercase tracking-[0.2em] mb-6"
            style={{ background: 'rgba(186, 84, 72, 0.2)', color: 'var(--gold)' }}
          >
            Free 2-Minute Quiz
          </span>

          <h2
            className="heading-serif text-2xl md:text-3xl lg:text-4xl font-light mb-4"
            style={{ color: 'var(--cream)', lineHeight: 1.2 }}
          >
            Not Sure If You Have{' '}
            <span className="italic" style={{ color: 'var(--light-blue)' }}>
              Attachment Issues?
            </span>
          </h2>

          <p
            className="text-base md:text-lg max-w-xl mx-auto mb-8"
            style={{ color: 'var(--cream)', opacity: 0.7, lineHeight: 1.6 }}
          >
            Discover your attachment style in under 2 minutes and learn why you keep attracting the wrong people.
          </p>

          <Link
            href="/quiz"
            className="group relative inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 overflow-hidden transition-all duration-500"
            style={{ background: 'var(--gold)', color: 'var(--navy)' }}
          >
            <span className="relative z-10 text-sm uppercase tracking-[0.15em] font-semibold">
              Take The Free Quiz
            </span>
            <svg
              className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            <div
              className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-0 -translate-x-full"
              style={{ background: 'var(--amber)' }}
            />
          </Link>

          <p
            className="mt-6 text-xs"
            style={{ color: 'var(--cream)', opacity: 0.4 }}
          >
            5 questions • Get your personalized results • 100% free
          </p>
        </div>
      </div>
    </section>
  );
}

// Introducing Section
export function IntroducingSection() {
  return (
    <section
      className="relative py-24 md:py-32 px-6"
      style={{ background: 'var(--white)' }}
    >
      <div className="max-w-5xl mx-auto">
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
                border: '1px solid rgba(129, 53, 46, 0.08)'
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
  );
}

// How It Works Section
export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-32 px-6"
      style={{ background: 'var(--navy)' }}
    >
      <GoldRect className="top-20 right-[8%] opacity-50" size="sm" delay={0} />
      <GoldRect className="bottom-32 left-[5%] opacity-40" size="md" delay={0.5} />

      <div className="max-w-6xl mx-auto">
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

      <PaintSplatter
        className="w-[300px] h-[300px] -bottom-16 right-[15%] opacity-15"
        color="var(--light-blue)"
        delay={0}
        scale={0.6}
      />
    </section>
  );
}

// Bonus Section
export function BonusSection() {
  return (
    <section
      className="relative py-24 md:py-32 px-6"
      style={{ background: 'var(--cream)' }}
    >
      <div className="max-w-5xl mx-auto">
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
  );
}

// Comparison Section
export function ComparisonSection() {
  return (
    <section
      className="relative py-24 md:py-32 px-6"
      style={{ background: 'var(--white)' }}
    >
      <div className="max-w-5xl mx-auto">
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

        <div className="grid md:grid-cols-2 gap-8">
          <div
            className="p-8"
            style={{ background: 'var(--cream)', border: '1px solid rgba(129, 53, 46, 0.1)' }}
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
                style={{ background: 'rgba(186, 84, 72, 0.08)' }}
              >
                <span style={{ color: 'var(--gold)' }}>•</span>
                <span style={{ color: 'var(--navy)', opacity: 0.8 }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Inside Program Section
export function InsideProgramSection() {
  return (
    <section
      className="relative py-24 md:py-32 px-6"
      style={{ background: 'linear-gradient(135deg, var(--blue) 0%, var(--navy) 100%)' }}
    >
      <div className="max-w-5xl mx-auto">
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
  );
}

// Testimonials Section
export function TestimonialsSection() {
  return (
    <section
      className="relative py-24 md:py-32 px-6"
      style={{ background: 'var(--cream)' }}
    >
      <div className="max-w-5xl mx-auto">
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
  );
}

// Target Audience Section
export function TargetAudienceSection() {
  return (
    <section
      className="relative py-24 md:py-32 px-6"
      style={{ background: 'var(--white)' }}
    >
      <div className="max-w-5xl mx-auto">
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

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8" style={{ background: 'rgba(186, 84, 72, 0.08)' }}>
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
  );
}

// Story Section
export function StorySection() {
  return (
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
  );
}

// Pricing Section
export function PricingSection() {
  return (
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

        <div
          className="p-8 md:p-12 mb-8 max-w-lg mx-auto"
          style={{ background: 'var(--white)', boxShadow: '0 16px 48px rgba(129, 53, 46, 0.12)' }}
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
  );
}

// Guarantee Section
export function GuaranteeSection() {
  return (
    <section
      className="relative py-20 md:py-24 px-6"
      style={{ background: 'var(--white)' }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <div
          className="inline-block px-6 py-3 mb-6"
          style={{ background: 'rgba(186, 84, 72, 0.1)' }}
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
  );
}

// Final CTA Section
export function FinalCTASection() {
  return (
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
  );
}

// Footer Section
export function FooterSection() {
  return (
    <footer
      className="relative py-20 px-6"
      style={{
        background: 'linear-gradient(180deg, var(--navy) 0%, #5A231F 100%)'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <Image
              src="/brand-logo.png"
              alt="21|Twenty One"
              width={256}
              height={256}
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-sm"
              loading="lazy"
              quality={80}
              style={{
                boxShadow: '0 8px 32px rgba(186, 84, 72, 0.2)',
                border: '2px solid rgba(186, 84, 72, 0.3)'
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
}

// Combined lazy sections wrapper
export default function LazySections() {
  return (
    <>
      <QuizCTASection />
      <IntroducingSection />
      <HowItWorksSection />
      <BonusSection />
      <ComparisonSection />
      <InsideProgramSection />
      <TestimonialsSection />
      <TargetAudienceSection />
      <StorySection />
      <PricingSection />
      <GuaranteeSection />
      <FinalCTASection />
      <FooterSection />
    </>
  );
}
