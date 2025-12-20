'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import './assessment.css';

type Step = 'welcome' | 'relationships' | 'patterns' | 'triggers' | 'goals' | 'commitment' | 'results';

type AttachmentStyle = 'secure' | 'anxious' | 'avoidant' | 'disorganized';

interface AssessmentData {
  relationshipScore: number;
  patterns: string[];
  triggers: string[];
  goals: string[];
  commitment: string;
}

const initialData: AssessmentData = {
  relationshipScore: 5,
  patterns: [],
  triggers: [],
  goals: [],
  commitment: '',
};

export default function AssessmentPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [step, setStep] = useState<Step>('welcome');
  const [data, setData] = useState<AssessmentData>(initialData);
  const [isAnimating, setIsAnimating] = useState(false);

  const t = translations[language];

  const steps: Step[] = ['welcome', 'relationships', 'patterns', 'triggers', 'goals', 'commitment', 'results'];
  const currentIndex = steps.indexOf(step);
  const progress = ((currentIndex) / (steps.length - 1)) * 100;

  const goToStep = (nextStep: Step) => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setIsAnimating(false);
    }, 300);
  };

  const toggleSelection = (field: 'patterns' | 'triggers' | 'goals', value: string) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 'patterns': return data.patterns.length > 0;
      case 'triggers': return data.triggers.length > 0;
      case 'goals': return data.goals.length > 0;
      case 'commitment': return data.commitment !== '';
      default: return true;
    }
  };

  // Calculate attachment style based on responses
  const getAttachmentStyle = (): AttachmentStyle => {
    const anxiousPatterns = ['fear-abandonment', 'need-reassurance', 'overthinking', 'jealousy'];
    const avoidantPatterns = ['independence', 'emotional-distance', 'avoid-commitment', 'self-reliant'];
    const disorganizedPatterns = ['push-pull', 'trust-issues', 'intense-emotions', 'fear-intimacy'];

    const anxiousScore = data.patterns.filter(p => anxiousPatterns.includes(p)).length;
    const avoidantScore = data.patterns.filter(p => avoidantPatterns.includes(p)).length;
    const disorganizedScore = data.patterns.filter(p => disorganizedPatterns.includes(p)).length;

    // Include relationship score in calculation
    const isLowComfort = data.relationshipScore <= 4;
    const isHighComfort = data.relationshipScore >= 7;

    // Determine dominant style
    if (disorganizedScore >= 2 || (anxiousScore >= 2 && avoidantScore >= 2)) {
      return 'disorganized';
    }
    if (anxiousScore > avoidantScore || (anxiousScore >= 2 && isLowComfort)) {
      return 'anxious';
    }
    if (avoidantScore > anxiousScore || (avoidantScore >= 2)) {
      return 'avoidant';
    }
    if (isHighComfort && anxiousScore <= 1 && avoidantScore <= 1) {
      return 'secure';
    }

    // Default based on relationship score
    if (isLowComfort) return 'anxious';
    if (data.relationshipScore <= 6) return 'avoidant';
    return 'secure';
  };

  // Get personalized insights based on attachment style
  const getInsights = () => {
    const style = getAttachmentStyle();
    const insights: { title: string; description: string; recommendation: string }[] = [];

    // Primary attachment insight
    insights.push({
      title: t.results.styles[style].insight,
      description: t.results.styles[style].insightDesc,
      recommendation: t.results.styles[style].recommendation
    });

    // Trigger-based insights
    if (data.triggers.includes('rejection') || data.triggers.includes('silence')) {
      insights.push({
        title: t.results.insightAbandonment,
        description: t.results.insightAbandonmentDesc,
        recommendation: t.results.recSelfSoothing
      });
    }

    if (data.triggers.includes('closeness') || data.triggers.includes('demands')) {
      insights.push({
        title: t.results.insightIntimacy,
        description: t.results.insightIntimacyDesc,
        recommendation: t.results.recBoundaries
      });
    }

    return insights;
  };

  const getPrimaryRecommendation = () => {
    const style = getAttachmentStyle();
    if (style === 'anxious' || data.relationshipScore <= 4) {
      return { path: '/breathing', label: t.results.ctaBreathing };
    }
    if (style === 'avoidant') {
      return { path: '/chat', label: t.results.ctaChat };
    }
    return { path: '/dashboard', label: t.results.ctaDashboard };
  };

  const attachmentStyle = getAttachmentStyle();

  return (
    <div className="assessment-container">
      {/* Background elements */}
      <div className="assessment-bg">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>

      {/* Progress bar - hidden on welcome and results */}
      {step !== 'welcome' && step !== 'results' && (
        <div className="progress-header">
          <button className="back-btn" onClick={() => goToStep(steps[currentIndex - 1])}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">{currentIndex}/{steps.length - 2}</span>
        </div>
      )}

      {/* Content */}
      <div className={`assessment-content ${isAnimating ? 'fade-out' : 'fade-in'}`}>

        {/* WELCOME */}
        {step === 'welcome' && (
          <div className="step-content welcome-step">
            <div className="welcome-badge">{t.welcome.badge}</div>
            <h1 className="welcome-title">{t.welcome.title}</h1>
            <p className="welcome-subtitle">{t.welcome.subtitle}</p>

            <div className="welcome-benefits">
              <div className="benefit">
                <div className="benefit-number">1</div>
                <p>{t.welcome.benefit1}</p>
              </div>
              <div className="benefit">
                <div className="benefit-number">2</div>
                <p>{t.welcome.benefit2}</p>
              </div>
              <div className="benefit">
                <div className="benefit-number">3</div>
                <p>{t.welcome.benefit3}</p>
              </div>
            </div>

            <p className="welcome-time">{t.welcome.time}</p>

            <button className="primary-btn" onClick={() => goToStep('relationships')}>
              {t.welcome.start}
            </button>
          </div>
        )}

        {/* RELATIONSHIP COMFORT */}
        {step === 'relationships' && (
          <div className="step-content">
            <h2 className="step-title">{t.relationships.title}</h2>
            <p className="step-subtitle">{t.relationships.subtitle}</p>

            <div className="wellbeing-scale">
              <div className="scale-visual">
                <div
                  className="scale-indicator"
                  style={{ left: `${(data.relationshipScore / 10) * 100}%` }}
                >
                  <span className="indicator-value">{data.relationshipScore}</span>
                </div>
                <div className="scale-track">
                  <div
                    className="scale-fill"
                    style={{ width: `${(data.relationshipScore / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={data.relationshipScore}
                onChange={(e) => setData(prev => ({ ...prev, relationshipScore: Number(e.target.value) }))}
                className="scale-slider"
              />
              <div className="scale-labels">
                <span>{t.relationships.low}</span>
                <span>{t.relationships.high}</span>
              </div>
            </div>

            <div className="scale-description">
              {data.relationshipScore <= 3 && <p className="desc-low">{t.relationships.descLow}</p>}
              {data.relationshipScore > 3 && data.relationshipScore <= 6 && <p className="desc-mid">{t.relationships.descMid}</p>}
              {data.relationshipScore > 6 && <p className="desc-high">{t.relationships.descHigh}</p>}
            </div>

            <button className="primary-btn" onClick={() => goToStep('patterns')}>
              {t.common.continue}
            </button>
          </div>
        )}

        {/* ATTACHMENT PATTERNS */}
        {step === 'patterns' && (
          <div className="step-content">
            <h2 className="step-title">{t.patterns.title}</h2>
            <p className="step-subtitle">{t.patterns.subtitle}</p>

            <div className="options-grid">
              {t.patterns.options.map((option) => (
                <button
                  key={option.value}
                  className={`option-card ${data.patterns.includes(option.value) ? 'selected' : ''}`}
                  onClick={() => toggleSelection('patterns', option.value)}
                >
                  <span className="option-label">{option.label}</span>
                  {data.patterns.includes(option.value) && (
                    <span className="check-mark">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button
              className={`primary-btn ${!canProceed() ? 'disabled' : ''}`}
              onClick={() => goToStep('triggers')}
              disabled={!canProceed()}
            >
              {t.common.continue}
            </button>
          </div>
        )}

        {/* RELATIONSHIP TRIGGERS */}
        {step === 'triggers' && (
          <div className="step-content">
            <h2 className="step-title">{t.triggers.title}</h2>
            <p className="step-subtitle">{t.triggers.subtitle}</p>

            <div className="options-grid">
              {t.triggers.options.map((option) => (
                <button
                  key={option.value}
                  className={`option-card ${data.triggers.includes(option.value) ? 'selected' : ''}`}
                  onClick={() => toggleSelection('triggers', option.value)}
                >
                  <span className="option-label">{option.label}</span>
                  {data.triggers.includes(option.value) && (
                    <span className="check-mark">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button
              className={`primary-btn ${!canProceed() ? 'disabled' : ''}`}
              onClick={() => goToStep('goals')}
              disabled={!canProceed()}
            >
              {t.common.continue}
            </button>
          </div>
        )}

        {/* HEALING GOALS */}
        {step === 'goals' && (
          <div className="step-content">
            <h2 className="step-title">{t.goals.title}</h2>
            <p className="step-subtitle">{t.goals.subtitle}</p>

            <div className="options-grid">
              {t.goals.options.map((option) => (
                <button
                  key={option.value}
                  className={`option-card ${data.goals.includes(option.value) ? 'selected' : ''}`}
                  onClick={() => toggleSelection('goals', option.value)}
                >
                  <span className="option-label">{option.label}</span>
                  {data.goals.includes(option.value) && (
                    <span className="check-mark">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button
              className={`primary-btn ${!canProceed() ? 'disabled' : ''}`}
              onClick={() => goToStep('commitment')}
              disabled={!canProceed()}
            >
              {t.common.continue}
            </button>
          </div>
        )}

        {/* COMMITMENT */}
        {step === 'commitment' && (
          <div className="step-content">
            <h2 className="step-title">{t.commitment.title}</h2>
            <p className="step-subtitle">{t.commitment.subtitle}</p>

            <div className="commitment-options">
              {t.commitment.options.map((option) => (
                <button
                  key={option.value}
                  className={`commitment-card ${data.commitment === option.value ? 'selected' : ''}`}
                  onClick={() => setData(prev => ({ ...prev, commitment: option.value }))}
                >
                  <span className="commitment-time">{option.time}</span>
                  <span className="commitment-label">{option.label}</span>
                  <span className="commitment-desc">{option.description}</span>
                </button>
              ))}
            </div>

            <button
              className={`primary-btn ${!canProceed() ? 'disabled' : ''}`}
              onClick={() => goToStep('results')}
              disabled={!canProceed()}
            >
              {t.commitment.seeResults}
            </button>
          </div>
        )}

        {/* RESULTS */}
        {step === 'results' && (
          <div className="step-content results-step">
            <div className="results-header">
              <div className="results-badge">{t.results.badge}</div>
              <h2 className="results-title">{t.results.title}</h2>
              <p className="results-subtitle">{t.results.subtitle}</p>
            </div>

            {/* Attachment Style Display */}
            <div className="attachment-style-card">
              <div className="style-label">{t.results.styleLabel}</div>
              <h3 className="style-name">{t.results.styles[attachmentStyle].name}</h3>
              <p className="style-description">{t.results.styles[attachmentStyle].description}</p>
              <div className="style-traits">
                {t.results.styles[attachmentStyle].traits.map((trait, index) => (
                  <span key={index} className="trait-tag">{trait}</span>
                ))}
              </div>
            </div>

            {/* Comfort Score Display */}
            <div className="score-card">
              <div className="score-label">{t.results.scoreLabel}</div>
              <div className="score-display">
                <div className="score-ring">
                  <svg viewBox="0 0 100 100">
                    <circle className="ring-bg" cx="50" cy="50" r="40"/>
                    <circle
                      className="ring-progress"
                      cx="50" cy="50" r="40"
                      strokeDasharray={`${(data.relationshipScore / 10) * 251.2} 251.2`}
                    />
                  </svg>
                  <span className="score-value">{data.relationshipScore}<span className="score-max">/10</span></span>
                </div>
              </div>
              <p className="score-interpretation">
                {data.relationshipScore <= 3 && t.results.scoreLow}
                {data.relationshipScore > 3 && data.relationshipScore <= 6 && t.results.scoreMid}
                {data.relationshipScore > 6 && t.results.scoreHigh}
              </p>
            </div>

            {/* Focus Areas */}
            <div className="focus-areas">
              <h3 className="section-title">{t.results.focusTitle}</h3>
              <div className="focus-tags">
                {data.patterns.map(pattern => {
                  const option = t.patterns.options.find(o => o.value === pattern);
                  return option ? (
                    <span key={pattern} className="focus-tag">{option.label}</span>
                  ) : null;
                })}
              </div>
            </div>

            {/* Personalized Insights */}
            <div className="insights-section">
              <h3 className="section-title">{t.results.insightsTitle}</h3>
              <div className="insights-list">
                {getInsights().map((insight, index) => (
                  <div key={index} className="insight-card">
                    <h4 className="insight-title">{insight.title}</h4>
                    <p className="insight-desc">{insight.description}</p>
                    <div className="insight-rec">
                      <span className="rec-label">{t.results.recLabel}</span>
                      <span className="rec-text">{insight.recommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 21-Day Journey Preview */}
            <div className="journey-preview">
              <h3 className="section-title">{t.results.journeyTitle}</h3>
              <div className="journey-timeline">
                <div className="timeline-item">
                  <div className="timeline-week">{t.results.week1}</div>
                  <div className="timeline-content">{t.results.week1Desc}</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-week">{t.results.week2}</div>
                  <div className="timeline-content">{t.results.week2Desc}</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-week">{t.results.week3}</div>
                  <div className="timeline-content">{t.results.week3Desc}</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="results-cta">
              <button
                className="primary-btn large"
                onClick={() => router.push(getPrimaryRecommendation().path)}
              >
                {getPrimaryRecommendation().label}
              </button>
              <button
                className="secondary-btn"
                onClick={() => router.push('/signup')}
              >
                {t.results.ctaSignup}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Translations
const translations = {
  en: {
    common: {
      continue: 'Continue',
    },
    welcome: {
      badge: 'Free Attachment Assessment',
      title: 'Discover Your Attachment Style',
      subtitle: 'Take 2 minutes to understand how you connect in relationships and get a personalized path to building secure, fulfilling bonds.',
      benefit1: 'Identify your attachment style',
      benefit2: 'Understand your relationship patterns',
      benefit3: 'Get your personalized 21-day healing plan',
      time: 'Takes only 2 minutes',
      start: 'Start My Assessment',
    },
    relationships: {
      title: 'How comfortable do you feel in close relationships?',
      subtitle: 'Think about your romantic relationships or close friendships. How secure do you generally feel?',
      low: 'Very Uncomfortable',
      high: 'Completely Secure',
      descLow: "Closeness may feel threatening or overwhelming to you. This is common with insecure attachment - and it can be healed.",
      descMid: "You experience some comfort but also some anxiety in close relationships. There's room to grow toward more security.",
      descHigh: "You feel relatively secure in your close relationships. Let's explore how to strengthen and maintain these bonds.",
    },
    patterns: {
      title: 'Which patterns show up in your relationships?',
      subtitle: 'Select all that resonate with you - there are no wrong answers',
      options: [
        { value: 'fear-abandonment', label: 'Fear of being abandoned' },
        { value: 'need-reassurance', label: 'Needing constant reassurance' },
        { value: 'overthinking', label: 'Overthinking texts & conversations' },
        { value: 'jealousy', label: 'Feeling jealous or insecure' },
        { value: 'independence', label: 'Valuing independence above all' },
        { value: 'emotional-distance', label: 'Keeping emotional distance' },
        { value: 'avoid-commitment', label: 'Avoiding deep commitment' },
        { value: 'self-reliant', label: 'Difficulty relying on others' },
        { value: 'push-pull', label: 'Push-pull dynamics' },
        { value: 'trust-issues', label: 'Difficulty trusting others' },
        { value: 'intense-emotions', label: 'Intense emotional reactions' },
        { value: 'fear-intimacy', label: 'Fear of true intimacy' },
      ],
    },
    triggers: {
      title: 'What triggers you most in relationships?',
      subtitle: 'Understanding your triggers is the first step to healing',
      options: [
        { value: 'rejection', label: 'Fear of rejection' },
        { value: 'silence', label: 'Partner going silent' },
        { value: 'closeness', label: 'Too much closeness' },
        { value: 'demands', label: 'Emotional demands' },
        { value: 'criticism', label: 'Criticism or judgment' },
        { value: 'change', label: 'Relationship changes' },
        { value: 'vulnerability', label: 'Being vulnerable' },
        { value: 'conflict', label: 'Any form of conflict' },
      ],
    },
    goals: {
      title: 'What do you hope to heal?',
      subtitle: 'Select the outcomes that matter most to you',
      options: [
        { value: 'secure-attachment', label: 'Develop secure attachment' },
        { value: 'trust', label: 'Build trust in relationships' },
        { value: 'communication', label: 'Communicate my needs clearly' },
        { value: 'boundaries', label: 'Set healthy boundaries' },
        { value: 'self-worth', label: 'Know my worth in relationships' },
        { value: 'past-wounds', label: 'Heal past relationship wounds' },
        { value: 'vulnerability', label: 'Be vulnerable without fear' },
        { value: 'lasting-love', label: 'Build lasting, healthy love' },
      ],
    },
    commitment: {
      title: 'How much time can you dedicate daily to healing?',
      subtitle: 'Consistency matters more than duration for attachment healing',
      options: [
        { value: '5min', time: '5 min', label: 'Gentle Start', description: 'Perfect for building the habit' },
        { value: '15min', time: '15 min', label: 'Balanced Healing', description: 'Recommended for lasting change' },
        { value: '30min', time: '30+min', label: 'Deep Transformation', description: 'For accelerated growth' },
      ],
      seeResults: 'Discover My Attachment Style',
    },
    results: {
      badge: 'Your Attachment Profile',
      title: 'Your Attachment Style Revealed',
      subtitle: 'Based on your responses, here\'s what we discovered about how you connect',
      styleLabel: 'Your Primary Attachment Style',
      styles: {
        secure: {
          name: 'Secure Attachment',
          description: 'You generally feel comfortable with intimacy and can balance closeness with independence. You trust others and believe you are worthy of love.',
          traits: ['Comfortable with intimacy', 'Good at communicating needs', 'Trusting of others', 'Emotionally available'],
          insight: 'Strengthening Your Foundation',
          insightDesc: 'Your secure base allows you to build even deeper connections. Focus on maintaining these healthy patterns while helping others feel safe with you.',
          recommendation: 'Explore advanced relationship skills and learn to support partners with different attachment styles'
        },
        anxious: {
          name: 'Anxious Attachment',
          description: 'You deeply crave closeness and often worry about your relationships. You may fear abandonment and seek constant reassurance from partners.',
          traits: ['Craves closeness', 'Fears abandonment', 'Highly attuned to others', 'Needs reassurance'],
          insight: 'Healing Your Inner Child',
          insightDesc: 'Your anxious attachment often stems from inconsistent caregiving in childhood. Learning to self-soothe and build internal security is key.',
          recommendation: 'Start with daily breathing exercises to calm your nervous system when anxiety arises'
        },
        avoidant: {
          name: 'Avoidant Attachment',
          description: 'You value independence highly and may feel uncomfortable with too much closeness. You tend to keep emotional distance to protect yourself.',
          traits: ['Values independence', 'Uncomfortable with closeness', 'Emotionally self-sufficient', 'Difficulty opening up'],
          insight: 'Opening to Connection',
          insightDesc: 'Your avoidant patterns developed as protection but now may keep you from the intimacy you deserve. Learning to slowly let others in is transformative.',
          recommendation: 'Practice vulnerability in small doses through guided AI conversations'
        },
        disorganized: {
          name: 'Fearful-Avoidant Attachment',
          description: 'You experience a push-pull dynamic - wanting closeness but fearing it at the same time. Relationships may feel confusing and intense.',
          traits: ['Wants and fears closeness', 'Intense emotions', 'Difficulty trusting', 'Push-pull patterns'],
          insight: 'Finding Your Center',
          insightDesc: 'Your attachment style often comes from early experiences where caregivers were both a source of comfort and fear. Healing involves creating new, safe relationship experiences.',
          recommendation: 'Begin with grounding exercises and learn to regulate intense emotions'
        }
      },
      scoreLabel: 'Relationship Comfort Level',
      scoreLow: 'Relationships feel challenging right now, but acknowledging this is the first step to healing.',
      scoreMid: 'You have capacity for connection but also experience significant relationship anxiety.',
      scoreHigh: 'You have a solid foundation for healthy relationships that we can build upon.',
      focusTitle: 'Your Relationship Patterns',
      insightsTitle: 'Personalized Insights',
      insightAbandonment: 'Abandonment Sensitivity',
      insightAbandonmentDesc: 'Your fear of rejection or silence indicates deep abandonment wounds that can be healed with the right approach.',
      insightIntimacy: 'Intimacy Boundaries',
      insightIntimacyDesc: 'Discomfort with closeness or demands suggests protective walls built from past hurts.',
      recLabel: 'We recommend:',
      recSelfSoothing: 'Learn self-soothing techniques for when fears arise',
      recBoundaries: 'Practice setting boundaries that honor your needs',
      journeyTitle: 'Your 21-Day Attachment Healing Journey',
      week1: 'Week 1',
      week1Desc: 'Awareness - Understanding your attachment wounds and triggers',
      week2: 'Week 2',
      week2Desc: 'Healing - Processing past hurts and building new neural pathways',
      week3: 'Week 3',
      week3Desc: 'Integration - Practicing secure attachment behaviors in daily life',
      ctaBreathing: 'Start with Calming Exercise',
      ctaChat: 'Begin Healing Conversation',
      ctaDashboard: 'Go to Dashboard',
      ctaSignup: 'Start Your 21-Day Journey',
    },
  },
  fr: {
    common: {
      continue: 'Continuer',
    },
    welcome: {
      badge: 'Évaluation d\'Attachement Gratuite',
      title: 'Découvrez Votre Style d\'Attachement',
      subtitle: 'Prenez 2 minutes pour comprendre comment vous vous connectez dans vos relations et obtenez un parcours personnalisé vers des liens sécurisants et épanouissants.',
      benefit1: 'Identifiez votre style d\'attachement',
      benefit2: 'Comprenez vos schémas relationnels',
      benefit3: 'Obtenez votre plan de guérison personnalisé de 21 jours',
      time: 'Seulement 2 minutes',
      start: 'Commencer Mon Évaluation',
    },
    relationships: {
      title: 'À quel point vous sentez-vous à l\'aise dans les relations proches ?',
      subtitle: 'Pensez à vos relations amoureuses ou amitiés proches. Comment vous sentez-vous généralement en sécurité ?',
      low: 'Très Inconfortable',
      high: 'Complètement Sécurisé(e)',
      descLow: "La proximité peut vous sembler menaçante ou accablante. C'est courant avec l'attachement insécure - et cela peut guérir.",
      descMid: "Vous ressentez un certain confort mais aussi de l'anxiété dans les relations proches. Il y a de la place pour grandir vers plus de sécurité.",
      descHigh: "Vous vous sentez relativement en sécurité dans vos relations proches. Explorons comment renforcer et maintenir ces liens.",
    },
    patterns: {
      title: 'Quels schémas apparaissent dans vos relations ?',
      subtitle: 'Sélectionnez tout ce qui vous parle - il n\'y a pas de mauvaises réponses',
      options: [
        { value: 'fear-abandonment', label: 'Peur d\'être abandonné(e)' },
        { value: 'need-reassurance', label: 'Besoin constant de réassurance' },
        { value: 'overthinking', label: 'Suranalyse des messages et conversations' },
        { value: 'jealousy', label: 'Jalousie ou insécurité' },
        { value: 'independence', label: 'Valoriser l\'indépendance avant tout' },
        { value: 'emotional-distance', label: 'Garder une distance émotionnelle' },
        { value: 'avoid-commitment', label: 'Éviter l\'engagement profond' },
        { value: 'self-reliant', label: 'Difficulté à compter sur les autres' },
        { value: 'push-pull', label: 'Dynamiques de rapprochement-éloignement' },
        { value: 'trust-issues', label: 'Difficulté à faire confiance' },
        { value: 'intense-emotions', label: 'Réactions émotionnelles intenses' },
        { value: 'fear-intimacy', label: 'Peur de la vraie intimité' },
      ],
    },
    triggers: {
      title: 'Qu\'est-ce qui vous déclenche le plus dans les relations ?',
      subtitle: 'Comprendre vos déclencheurs est la première étape vers la guérison',
      options: [
        { value: 'rejection', label: 'Peur du rejet' },
        { value: 'silence', label: 'Quand le partenaire se tait' },
        { value: 'closeness', label: 'Trop de proximité' },
        { value: 'demands', label: 'Demandes émotionnelles' },
        { value: 'criticism', label: 'Critique ou jugement' },
        { value: 'change', label: 'Changements relationnels' },
        { value: 'vulnerability', label: 'Être vulnérable' },
        { value: 'conflict', label: 'Toute forme de conflit' },
      ],
    },
    goals: {
      title: 'Qu\'espérez-vous guérir ?',
      subtitle: 'Sélectionnez les résultats qui comptent le plus pour vous',
      options: [
        { value: 'secure-attachment', label: 'Développer un attachement sécure' },
        { value: 'trust', label: 'Construire la confiance dans les relations' },
        { value: 'communication', label: 'Communiquer mes besoins clairement' },
        { value: 'boundaries', label: 'Établir des limites saines' },
        { value: 'self-worth', label: 'Connaître ma valeur dans les relations' },
        { value: 'past-wounds', label: 'Guérir les blessures relationnelles passées' },
        { value: 'vulnerability', label: 'Être vulnérable sans peur' },
        { value: 'lasting-love', label: 'Construire un amour durable et sain' },
      ],
    },
    commitment: {
      title: 'Combien de temps pouvez-vous consacrer quotidiennement à la guérison ?',
      subtitle: 'La constance compte plus que la durée pour la guérison de l\'attachement',
      options: [
        { value: '5min', time: '5 min', label: 'Début en Douceur', description: 'Parfait pour créer l\'habitude' },
        { value: '15min', time: '15 min', label: 'Guérison Équilibrée', description: 'Recommandé pour un changement durable' },
        { value: '30min', time: '30+min', label: 'Transformation Profonde', description: 'Pour une croissance accélérée' },
      ],
      seeResults: 'Découvrir Mon Style d\'Attachement',
    },
    results: {
      badge: 'Votre Profil d\'Attachement',
      title: 'Votre Style d\'Attachement Révélé',
      subtitle: 'Basé sur vos réponses, voici ce que nous avons découvert sur votre façon de vous connecter',
      styleLabel: 'Votre Style d\'Attachement Principal',
      styles: {
        secure: {
          name: 'Attachement Sécure',
          description: 'Vous vous sentez généralement à l\'aise avec l\'intimité et pouvez équilibrer la proximité avec l\'indépendance. Vous faites confiance aux autres et croyez mériter l\'amour.',
          traits: ['À l\'aise avec l\'intimité', 'Communique bien ses besoins', 'Fait confiance aux autres', 'Disponible émotionnellement'],
          insight: 'Renforcer Votre Fondation',
          insightDesc: 'Votre base sécure vous permet de construire des connexions encore plus profondes. Concentrez-vous sur le maintien de ces schémas sains.',
          recommendation: 'Explorez des compétences relationnelles avancées et apprenez à soutenir des partenaires avec différents styles d\'attachement'
        },
        anxious: {
          name: 'Attachement Anxieux',
          description: 'Vous avez un profond besoin de proximité et vous vous inquiétez souvent pour vos relations. Vous pouvez craindre l\'abandon et chercher une réassurance constante.',
          traits: ['Désire la proximité', 'Craint l\'abandon', 'Très attentif aux autres', 'Besoin de réassurance'],
          insight: 'Guérir Votre Enfant Intérieur',
          insightDesc: 'Votre attachement anxieux provient souvent de soins incohérents dans l\'enfance. Apprendre à vous auto-apaiser et à construire une sécurité interne est essentiel.',
          recommendation: 'Commencez par des exercices de respiration quotidiens pour calmer votre système nerveux'
        },
        avoidant: {
          name: 'Attachement Évitant',
          description: 'Vous valorisez fortement l\'indépendance et pouvez vous sentir mal à l\'aise avec trop de proximité. Vous avez tendance à garder une distance émotionnelle pour vous protéger.',
          traits: ['Valorise l\'indépendance', 'Inconfortable avec la proximité', 'Autosuffisant émotionnellement', 'Difficulté à s\'ouvrir'],
          insight: 'S\'Ouvrir à la Connexion',
          insightDesc: 'Vos schémas évitants se sont développés comme protection mais peuvent maintenant vous empêcher d\'accéder à l\'intimité que vous méritez.',
          recommendation: 'Pratiquez la vulnérabilité en petites doses à travers des conversations guidées'
        },
        disorganized: {
          name: 'Attachement Craintif-Évitant',
          description: 'Vous vivez une dynamique de rapprochement-éloignement - voulant la proximité mais la craignant en même temps. Les relations peuvent sembler confuses et intenses.',
          traits: ['Veut et craint la proximité', 'Émotions intenses', 'Difficulté à faire confiance', 'Schémas de rapprochement-éloignement'],
          insight: 'Trouver Votre Centre',
          insightDesc: 'Votre style d\'attachement vient souvent d\'expériences précoces où les soignants étaient à la fois source de réconfort et de peur. La guérison implique de créer de nouvelles expériences relationnelles sécurisantes.',
          recommendation: 'Commencez par des exercices d\'ancrage et apprenez à réguler les émotions intenses'
        }
      },
      scoreLabel: 'Niveau de Confort Relationnel',
      scoreLow: 'Les relations sont difficiles en ce moment, mais reconnaître cela est la première étape vers la guérison.',
      scoreMid: 'Vous avez une capacité de connexion mais aussi une anxiété relationnelle significative.',
      scoreHigh: 'Vous avez une base solide pour des relations saines sur laquelle nous pouvons construire.',
      focusTitle: 'Vos Schémas Relationnels',
      insightsTitle: 'Insights Personnalisés',
      insightAbandonment: 'Sensibilité à l\'Abandon',
      insightAbandonmentDesc: 'Votre peur du rejet ou du silence indique des blessures d\'abandon profondes qui peuvent être guéries.',
      insightIntimacy: 'Limites d\'Intimité',
      insightIntimacyDesc: 'L\'inconfort face à la proximité ou aux demandes suggère des murs protecteurs construits à partir de blessures passées.',
      recLabel: 'Nous recommandons :',
      recSelfSoothing: 'Apprenez des techniques d\'auto-apaisement pour quand les peurs surgissent',
      recBoundaries: 'Pratiquez l\'établissement de limites qui honorent vos besoins',
      journeyTitle: 'Votre Parcours de Guérison de l\'Attachement en 21 Jours',
      week1: 'Semaine 1',
      week1Desc: 'Conscience - Comprendre vos blessures et déclencheurs d\'attachement',
      week2: 'Semaine 2',
      week2Desc: 'Guérison - Traiter les blessures passées et créer de nouveaux schémas neuronaux',
      week3: 'Semaine 3',
      week3Desc: 'Intégration - Pratiquer des comportements d\'attachement sécure au quotidien',
      ctaBreathing: 'Commencer par un Exercice Apaisant',
      ctaChat: 'Commencer la Conversation de Guérison',
      ctaDashboard: 'Aller au Tableau de Bord',
      ctaSignup: 'Commencer Votre Parcours de 21 Jours',
    },
  },
};
