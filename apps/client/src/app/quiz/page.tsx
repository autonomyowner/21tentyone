'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './quiz.css';

type Step = 'intro' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'email' | 'results';
type AttachmentStyle = 'secure' | 'anxious' | 'avoidant' | 'fearful-avoidant';

interface QuizAnswers {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
}

const questions = {
  q1: {
    title: "When your partner doesn't text back for a few hours, you usually...",
    options: [
      { value: 'anxious-1', label: "Check your phone repeatedly and feel anxious" },
      { value: 'secure-1', label: "Assume they're busy and go about your day" },
      { value: 'avoidant-1', label: "Feel relieved to have some space" },
      { value: 'fearful-1', label: "Swing between worry and telling yourself you don't care" },
    ]
  },
  q2: {
    title: "When someone gets too close emotionally, you tend to...",
    options: [
      { value: 'anxious-2', label: "Feel happy and want even more closeness" },
      { value: 'secure-2', label: "Enjoy it while maintaining your own identity" },
      { value: 'avoidant-2', label: "Feel suffocated and need to pull back" },
      { value: 'fearful-2', label: "Want it but also feel scared and withdraw" },
    ]
  },
  q3: {
    title: "After a disagreement with your partner, you typically...",
    options: [
      { value: 'anxious-3', label: "Need to resolve it immediately and seek reassurance" },
      { value: 'secure-3', label: "Take time to cool down, then discuss calmly" },
      { value: 'avoidant-3', label: "Prefer to move on without discussing feelings" },
      { value: 'fearful-3', label: "Alternate between reaching out and shutting down" },
    ]
  },
  q4: {
    title: "Your biggest fear in relationships is...",
    options: [
      { value: 'anxious-4', label: "Being abandoned or not being loved enough" },
      { value: 'secure-4', label: "Losing connection but you trust it can be rebuilt" },
      { value: 'avoidant-4', label: "Losing your independence or being controlled" },
      { value: 'fearful-4', label: "Both being abandoned AND getting too close" },
    ]
  },
  q5: {
    title: "When you're feeling vulnerable, you typically...",
    options: [
      { value: 'anxious-5', label: "Reach out for support and validation" },
      { value: 'secure-5', label: "Share with trusted people while also self-soothing" },
      { value: 'avoidant-5', label: "Handle it alone - you don't like burdening others" },
      { value: 'fearful-5', label: "Want support but feel unsafe asking for it" },
    ]
  },
};

const attachmentResults = {
  anxious: {
    name: 'Anxious Attachment',
    emoji: '',
    description: 'You crave closeness and connection deeply. You may worry about your relationships and need reassurance that you are loved.',
    blindSpots: [
      'Interpreting normal space as rejection',
      'Seeking excessive reassurance',
      'Losing yourself in relationships',
    ],
    tip: 'Practice self-soothing when anxiety arises. Your worth isn\'t determined by others\' responses.',
    healingPath: 'The 21-day protocol will help you build internal security so you stop abandoning yourself for others.',
  },
  avoidant: {
    name: 'Avoidant Attachment',
    emoji: '',
    description: 'You value independence highly and may feel uncomfortable with too much closeness. Emotions can feel overwhelming.',
    blindSpots: [
      'Pushing away people who get close',
      'Dismissing your own emotional needs',
      'Difficulty asking for help',
    ],
    tip: 'Intimacy isn\'t a threat to your freedom. Small steps toward vulnerability build trust.',
    healingPath: 'The 21-day protocol will help you safely open up without losing yourself in the process.',
  },
  'fearful-avoidant': {
    name: 'Fearful-Avoidant Attachment',
    emoji: '',
    description: 'You experience a push-pull pattern - wanting love deeply but fearing it at the same time. Relationships can feel confusing.',
    blindSpots: [
      'Hot and cold behavior with partners',
      'Self-sabotaging good relationships',
      'Difficulty trusting your own feelings',
    ],
    tip: 'Your conflicting feelings make sense given your past. Healing happens one safe experience at a time.',
    healingPath: 'The 21-day protocol will help you find your center and break the push-pull cycle.',
  },
  secure: {
    name: 'Secure Attachment',
    emoji: '',
    description: 'You feel comfortable with intimacy and can balance closeness with independence. You trust that relationships can weather storms.',
    blindSpots: [
      'May not understand insecure partners',
      'Could benefit from deeper self-awareness',
      'Opportunity to strengthen existing patterns',
    ],
    tip: 'Your secure base is a gift. Understanding attachment helps you support others and deepen connections.',
    healingPath: 'The 21-day protocol will help you maintain your secure foundation and attract healthier partners.',
  },
};

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('intro');
  const [answers, setAnswers] = useState<QuizAnswers>({ q1: '', q2: '', q3: '', q4: '', q5: '' });
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [clickedOption, setClickedOption] = useState<string | null>(null);

  const steps: Step[] = ['intro', 'q1', 'q2', 'q3', 'q4', 'q5', 'email', 'results'];
  const questionSteps = ['q1', 'q2', 'q3', 'q4', 'q5'];
  const currentIndex = steps.indexOf(step);
  const progress = step === 'intro' ? 0 : step === 'email' ? 100 : step === 'results' ? 100 : ((questionSteps.indexOf(step) + 1) / questionSteps.length) * 100;

  const goToStep = (nextStep: Step) => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setIsAnimating(false);
      setClickedOption(null);
    }, 300);
  };

  const handleAnswer = (questionKey: keyof QuizAnswers, value: string) => {
    // Set clicked state immediately for visual feedback
    setClickedOption(value);

    // Update answer
    setAnswers(prev => ({ ...prev, [questionKey]: value }));

    // Auto-advance after selection with smooth delay
    const currentQ = questionSteps.indexOf(questionKey as string);
    const nextStep = currentQ < questionSteps.length - 1
      ? questionSteps[currentQ + 1] as Step
      : 'email';

    // Delay to let user see selection before transitioning
    setTimeout(() => goToStep(nextStep), 500);
  };

  const calculateAttachmentStyle = (): AttachmentStyle => {
    const scores = { anxious: 0, avoidant: 0, 'fearful-avoidant': 0, secure: 0 };

    Object.values(answers).forEach(answer => {
      if (answer.startsWith('anxious')) scores.anxious++;
      else if (answer.startsWith('avoidant')) scores.avoidant++;
      else if (answer.startsWith('fearful')) scores['fearful-avoidant']++;
      else if (answer.startsWith('secure')) scores.secure++;
    });

    // Find highest score
    let maxStyle: AttachmentStyle = 'anxious';
    let maxScore = 0;
    (Object.entries(scores) as [AttachmentStyle, number][]).forEach(([style, score]) => {
      if (score > maxScore) {
        maxScore = score;
        maxStyle = style;
      }
    });

    return maxStyle;
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);

    // Store email (you can connect to your backend/email service here)
    try {
      // For now, store in localStorage and log
      const quizData = {
        email,
        attachmentStyle: calculateAttachmentStyle(),
        answers,
        completedAt: new Date().toISOString(),
      };

      // Store locally
      const existingLeads = JSON.parse(localStorage.getItem('quiz-leads') || '[]');
      existingLeads.push(quizData);
      localStorage.setItem('quiz-leads', JSON.stringify(existingLeads));

      // Log for debugging (replace with actual API call)
      console.log('Quiz lead captured:', quizData);

      // TODO: Send to your email service/backend
      // await fetch('/api/quiz-lead', { method: 'POST', body: JSON.stringify(quizData) });

      setTimeout(() => {
        setIsSubmitting(false);
        goToStep('results');
      }, 800);
    } catch {
      setIsSubmitting(false);
      setEmailError('Something went wrong. Please try again.');
    }
  };

  const attachmentStyle = calculateAttachmentStyle();
  const result = attachmentResults[attachmentStyle];

  return (
    <div className="quiz-container">
      {/* Background */}
      <div className="quiz-bg">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
      </div>

      {/* Progress bar */}
      {step !== 'intro' && step !== 'results' && (
        <div className="quiz-progress-header">
          {step !== 'email' && (
            <button
              className="quiz-back-btn"
              onClick={() => {
                const prevIndex = currentIndex - 1;
                if (prevIndex >= 0) goToStep(steps[prevIndex]);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          )}
          <div className="quiz-progress-track">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          {step !== 'email' && (
            <span className="quiz-progress-text">{questionSteps.indexOf(step) + 1}/5</span>
          )}
        </div>
      )}

      {/* Content */}
      <div className={`quiz-content ${isAnimating ? 'fade-out' : 'fade-in'}`}>

        {/* INTRO */}
        {step === 'intro' && (
          <div className="quiz-step quiz-intro">
            <div className="quiz-badge">Free 2-Minute Quiz</div>
            <h1 className="quiz-main-title">What's Your Attachment Style?</h1>
            <p className="quiz-main-subtitle">
              Discover why you keep attracting the wrong people—and how to break the pattern in 21 days.
            </p>

            <div className="quiz-benefits">
              <div className="quiz-benefit">
                <span className="benefit-check">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span>Uncover your attachment pattern</span>
              </div>
              <div className="quiz-benefit">
                <span className="benefit-check">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span>Learn your 3 relationship blind spots</span>
              </div>
              <div className="quiz-benefit">
                <span className="benefit-check">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span>Get a personalized healing tip</span>
              </div>
            </div>

            <button className="quiz-primary-btn" onClick={() => goToStep('q1')}>
              Start The Quiz
            </button>

            <p className="quiz-disclaimer">
              5 questions · Takes under 2 minutes · 100% free
            </p>
          </div>
        )}

        {/* QUESTIONS */}
        {questionSteps.includes(step) && (
          <div className="quiz-step quiz-question">
            <h2 className="quiz-question-title">
              {questions[step as keyof typeof questions].title}
            </h2>
            <div className="quiz-options">
              {questions[step as keyof typeof questions].options.map((option, index) => {
                const isSelected = answers[step as keyof QuizAnswers] === option.value;
                const isClicking = clickedOption === option.value;

                return (
                  <button
                    key={option.value}
                    className={`quiz-option ${isSelected ? 'selected' : ''} ${isClicking ? 'clicking' : ''}`}
                    onClick={() => handleAnswer(step as keyof QuizAnswers, option.value)}
                    disabled={clickedOption !== null}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <span className="option-text">{option.label}</span>
                    {isSelected && (
                      <span className="option-check">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* EMAIL CAPTURE */}
        {step === 'email' && (
          <div className="quiz-step quiz-email">
            <div className="email-lock-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2 className="quiz-email-title">Your Results Are Ready</h2>
            <p className="quiz-email-subtitle">
              Enter your email to unlock your attachment style profile and personalized insights.
            </p>

            <form onSubmit={handleEmailSubmit} className="quiz-email-form">
              <div className="email-input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  placeholder="Enter your email"
                  className={`quiz-email-input ${emailError ? 'error' : ''}`}
                  autoFocus
                />
                {emailError && <span className="email-error">{emailError}</span>}
              </div>
              <button
                type="submit"
                className={`quiz-primary-btn ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Analyzing...' : 'Reveal My Attachment Style'}
              </button>
            </form>

            <p className="quiz-privacy">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        )}

        {/* RESULTS */}
        {step === 'results' && (
          <div className="quiz-step quiz-results">
            <div className="results-header">
              <div className="results-badge-type">{result.name}</div>
              <h2 className="results-main-title">Your Attachment Profile</h2>
            </div>

            <div className="results-card">
              <p className="results-description">{result.description}</p>
            </div>

            <div className="results-section">
              <h3 className="results-section-title">Your 3 Relationship Blind Spots</h3>
              <div className="blind-spots">
                {result.blindSpots.map((spot, index) => (
                  <div key={index} className="blind-spot">
                    <span className="spot-number">{index + 1}</span>
                    <span className="spot-text">{spot}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="results-tip-card">
              <div className="tip-label">Quick Tip for You</div>
              <p className="tip-text">{result.tip}</p>
            </div>

            <div className="results-cta-section">
              <div className="cta-healing-text">
                <p>{result.healingPath}</p>
              </div>
              <Link href="/the-twenty-one" className="quiz-cta-btn">
                Start Your 21-Day Healing Journey
              </Link>
              <Link href="/assessment" className="quiz-secondary-link">
                Take the full assessment for deeper insights
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
