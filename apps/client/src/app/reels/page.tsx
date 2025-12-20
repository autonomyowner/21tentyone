'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { reelsData } from './reels-data';
import './reels.css';

export default function ReelsPage() {
  const [activeReelId, setActiveReelId] = useState('transformation');
  const [currentScene, setCurrentScene] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  const activeReel = reelsData.find(r => r.id === activeReelId) || reelsData[0];

  useEffect(() => {
    // Reset when changing reels
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    startTimeRef.current = null;
    setCurrentScene(1);
    setProgress(0);
    setIsPlaying(true);
  }, [activeReelId]);

  useEffect(() => {
    if (!isPlaying) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      setProgress((elapsed / activeReel.duration) * 100);

      for (let i = 0; i < activeReel.timeline.length; i++) {
        if (elapsed >= activeReel.timeline[i].start && elapsed < activeReel.timeline[i].end) {
          if (currentScene !== activeReel.timeline[i].scene) {
            setCurrentScene(activeReel.timeline[i].scene);
          }
          break;
        }
      }

      if (elapsed < activeReel.duration) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          startTimeRef.current = null;
          setCurrentScene(1);
          setProgress(0);
          animationRef.current = requestAnimationFrame(animate);
        }, 2000);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentScene, activeReel]);

  const togglePlay = () => {
    if (isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      startTimeRef.current = null;
    }
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    startTimeRef.current = null;
    setCurrentScene(1);
    setProgress(0);
    setIsPlaying(true);
  };

  const switchReel = (reelId: string) => {
    if (reelId !== activeReelId) {
      setActiveReelId(reelId);
    }
  };

  return (
    <div className="reels-page">
      {/* Header */}
      <div className="reels-header">
        <Link href="/" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </Link>
        <h1 className="reels-title">Reel Preview</h1>
        <div className="header-spacer"></div>
      </div>

      {/* Reel Selector */}
      <div className="reel-selector">
        {reelsData.map(reel => (
          <button
            key={reel.id}
            className={`reel-tab ${activeReelId === reel.id ? 'active' : ''}`}
            onClick={() => switchReel(reel.id)}
          >
            <span className="tab-title">{reel.title}</span>
            {activeReelId === reel.id && <span className="tab-indicator"></span>}
          </button>
        ))}
      </div>

      <div className="reels-content">
        {/* Phone Frame */}
        <div className="phone-frame">
          <div className="phone-notch"></div>
          <div className="phone-screen">
            {/* Transformation Reel */}
            {activeReelId === 'transformation' && (
              <TransformationReel currentScene={currentScene} />
            )}

            {/* Relationships Reel */}
            {activeReelId === 'relationships' && (
              <RelationshipsReel currentScene={currentScene} />
            )}

            {/* Coffee Health Reel */}
            {activeReelId === 'coffee-health' && (
              <CoffeeHealthReel currentScene={currentScene} />
            )}

            {/* Progress Bar */}
            <div className="reel-progress">
              <div className="reel-progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Controls & Info */}
        <div className="reels-info">
          <div className="info-card">
            <h2>{activeReel.title}</h2>
            <p className="info-desc">{activeReel.description}</p>

            <div className="controls">
              <button className="control-btn" onClick={togglePlay}>
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1"/>
                    <rect x="14" y="4" width="4" height="16" rx="1"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button className="control-btn secondary" onClick={restart}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4v6h6M23 20v-6h-6"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
                Restart
              </button>
            </div>

            <div className="scene-indicator">
              <span className="scene-label">Scene {currentScene} of {activeReel.scenes.length}</span>
              <div className="scene-dots">
                {activeReel.scenes.map((_, i) => (
                  <div key={i} className={`scene-dot ${currentScene === i + 1 ? 'active' : ''} ${currentScene > i + 1 ? 'completed' : ''}`}></div>
                ))}
              </div>
            </div>
          </div>

          <div className="info-card script-card">
            <h3>Voiceover Script</h3>
            <div className="script-timeline">
              {activeReel.scenes.map((scene) => (
                <div key={scene.id} className={`script-item ${currentScene === scene.id ? 'active' : ''}`}>
                  <span className="time">{scene.timestamp}</span>
                  <p>"{scene.voiceover}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="info-card">
            <h3>Hashtags</h3>
            <div className="hashtags">
              {activeReel.hashtags.map((tag, i) => (
                <span key={i}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TRANSFORMATION REEL COMPONENT
// ═══════════════════════════════════════════════════════════
function TransformationReel({ currentScene }: { currentScene: number }) {
  return (
    <>
      {/* Scene 1: The Weight */}
      <div className={`scene scene-1 ${currentScene === 1 ? 'active' : ''}`}>
        <div className="heavy-blob heavy-blob-1"></div>
        <div className="heavy-blob heavy-blob-2"></div>
        <div className="weight-particle" style={{ left: '15%', animationDelay: '0s' }}></div>
        <div className="weight-particle" style={{ left: '30%', animationDelay: '0.5s' }}></div>
        <div className="weight-particle" style={{ left: '45%', animationDelay: '1s' }}></div>
        <div className="weight-particle" style={{ left: '60%', animationDelay: '1.5s' }}></div>
        <div className="weight-particle" style={{ left: '75%', animationDelay: '2s' }}></div>
        <p className="weight-text">You've been carrying<br/>this weight<br/>for years...</p>
      </div>

      {/* Scene 2: The Struggle */}
      <div className={`scene scene-2 ${currentScene === 2 ? 'active' : ''}`}>
        <div className="chaos-line" style={{ top: '20%', width: '60%', left: '20%' }}></div>
        <div className="chaos-line" style={{ top: '50%', width: '80%', left: '10%', animationDelay: '-1s' }}></div>
        <div className="chaos-line" style={{ top: '80%', width: '50%', left: '30%', animationDelay: '-2s' }}></div>
        <div className="struggle-words">
          <span className={`struggle-word ${currentScene === 2 ? 'reveal' : ''}`}>Anxiety</span>
          <span className={`struggle-word ${currentScene === 2 ? 'reveal' : ''}`}>Overthinking</span>
          <span className={`struggle-word ${currentScene === 2 ? 'reveal' : ''}`}>Exhaustion</span>
        </div>
      </div>

      {/* Scene 3: The Discovery */}
      <div className={`scene scene-3 ${currentScene === 3 ? 'active' : ''}`}>
        <div className="glow-ring"></div>
        <div className="glow-ring"></div>
        <div className="glow-ring"></div>
        <p className={`discovery-question ${currentScene === 3 ? 'reveal' : ''}`}>
          What if<br/><span className="highlight-21">21 days</span><br/>could change<br/>everything?
        </p>
      </div>

      {/* Scene 4: The Journey */}
      <div className={`scene scene-4 ${currentScene === 4 ? 'active' : ''}`}>
        <div className="journey-blob journey-blob-1"></div>
        <div className="journey-blob journey-blob-2"></div>
        <div className="journey-container">
          <span className="day-label">Day</span>
          <DayCounter isActive={currentScene === 4} />
          <p className={`journey-text ${currentScene === 4 ? 'reveal' : ''}`}>
            Day by day.<br/>Breath by breath.<br/>You learn to let go.
          </p>
          <ProgressDots isActive={currentScene === 4} />
        </div>
      </div>

      {/* Scene 5: The Transformation */}
      <div className={`scene scene-5 ${currentScene === 5 ? 'active' : ''}`}>
        <div className="sun-glow"></div>
        <div className="celebration-particle" style={{ left: '20%', animationDelay: '0s' }}></div>
        <div className="celebration-particle" style={{ left: '35%', animationDelay: '0.3s' }}></div>
        <div className="celebration-particle" style={{ left: '50%', animationDelay: '0.6s' }}></div>
        <div className="celebration-particle" style={{ left: '65%', animationDelay: '0.9s' }}></div>
        <div className="celebration-particle" style={{ left: '80%', animationDelay: '1.2s' }}></div>
        <p className={`transform-text ${currentScene === 5 ? 'reveal' : ''}`}>
          And finally...<br/>you feel <span className="light">light</span> again.
        </p>
      </div>

      {/* Scene 6: CTA */}
      <div className={`scene scene-6 ${currentScene === 6 ? 'active' : ''}`}>
        <div className="cta-content">
          <span className={`brand-name ${currentScene === 6 ? 'reveal' : ''}`}>Brand 21Day</span>
          <p className={`cta-text ${currentScene === 6 ? 'reveal' : ''}`}>Your reset<br/>starts now.</p>
          <div className={`cta-button ${currentScene === 6 ? 'reveal' : ''}`}>Start Free Assessment</div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// RELATIONSHIPS REEL COMPONENT
// ═══════════════════════════════════════════════════════════
function RelationshipsReel({ currentScene }: { currentScene: number }) {
  return (
    <>
      {/* Scene 1: You Gave Everything */}
      <div className={`scene rel-scene-1 ${currentScene === 1 ? 'active' : ''}`}>
        <div className="shattered-heart">
          <div className="heart-piece piece-1"></div>
          <div className="heart-piece piece-2"></div>
          <div className="heart-piece piece-3"></div>
          <div className="heart-piece piece-4"></div>
        </div>
        <p className={`rel-text-main ${currentScene === 1 ? 'reveal' : ''}`}>
          You gave <span className="emphasis">everything</span>...
        </p>
        <p className={`rel-text-sub ${currentScene === 1 ? 'reveal' : ''}`}>
          and lost yourself.
        </p>
      </div>

      {/* Scene 2: Walking on Eggshells */}
      <div className={`scene rel-scene-2 ${currentScene === 2 ? 'active' : ''}`}>
        <div className="eggshell-cracks">
          <div className="crack crack-1"></div>
          <div className="crack crack-2"></div>
          <div className="crack crack-3"></div>
        </div>
        <div className="pain-words">
          <span className={`pain-word ${currentScene === 2 ? 'reveal' : ''}`}>Walking on eggshells</span>
          <span className={`pain-word ${currentScene === 2 ? 'reveal' : ''}`}>Never good enough</span>
          <span className={`pain-word ${currentScene === 2 ? 'reveal' : ''}`}>Always apologizing</span>
        </div>
      </div>

      {/* Scene 3: You Knew */}
      <div className={`scene rel-scene-3 ${currentScene === 3 ? 'active' : ''}`}>
        <div className="fog-layer"></div>
        <p className={`knowing-text ${currentScene === 3 ? 'reveal' : ''}`}>
          You knew something<br/>was <span className="wrong">wrong</span>...
        </p>
        <p className={`but-text ${currentScene === 3 ? 'reveal' : ''}`}>
          but you stayed.
        </p>
      </div>

      {/* Scene 4: Fear of Leaving */}
      <div className={`scene rel-scene-4 ${currentScene === 4 ? 'active' : ''}`}>
        <div className="prison-bars">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <p className={`fear-text ${currentScene === 4 ? 'reveal' : ''}`}>
          Because leaving felt<br/><span className="scarier">scarier</span><br/>than staying broken.
        </p>
      </div>

      {/* Scene 5: The Truth */}
      <div className={`scene rel-scene-5 ${currentScene === 5 ? 'active' : ''}`}>
        <div className="light-rays">
          <div className="ray ray-1"></div>
          <div className="ray ray-2"></div>
          <div className="ray ray-3"></div>
        </div>
        <p className={`truth-intro ${currentScene === 5 ? 'reveal' : ''}`}>
          But here's the truth<br/>they never told you...
        </p>
      </div>

      {/* Scene 6: Not The Problem */}
      <div className={`scene rel-scene-6 ${currentScene === 6 ? 'active' : ''}`}>
        <div className="glow-burst"></div>
        <p className={`revelation-text ${currentScene === 6 ? 'reveal' : ''}`}>
          You were <span className="never">never</span><br/>the problem.
        </p>
      </div>

      {/* Scene 7: Choose Yourself */}
      <div className={`scene rel-scene-7 ${currentScene === 7 ? 'active' : ''}`}>
        <div className="rising-particles">
          <div className="rise-particle" style={{ left: '20%', animationDelay: '0s' }}></div>
          <div className="rise-particle" style={{ left: '40%', animationDelay: '0.2s' }}></div>
          <div className="rise-particle" style={{ left: '60%', animationDelay: '0.4s' }}></div>
          <div className="rise-particle" style={{ left: '80%', animationDelay: '0.6s' }}></div>
        </div>
        <p className={`choose-text ${currentScene === 7 ? 'reveal' : ''}`}>
          It's time to<br/><span className="choose">choose yourself.</span>
        </p>
        <div className={`rel-cta-button ${currentScene === 7 ? 'reveal' : ''}`}>
          Start Your Healing
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// COFFEE HEALTH REEL COMPONENT
// ═══════════════════════════════════════════════════════════
function CoffeeHealthReel({ currentScene }: { currentScene: number }) {
  return (
    <>
      {/* Scene 1: Hook - Coffee as Ally */}
      <div className={`scene coffee-scene-1 ${currentScene === 1 ? 'active' : ''}`}>
        <div className="coffee-steam">
          <div className="steam-line steam-1"></div>
          <div className="steam-line steam-2"></div>
          <div className="steam-line steam-3"></div>
        </div>
        <div className="coffee-cup-shape"></div>
        <p className={`coffee-hook ${currentScene === 1 ? 'reveal' : ''}`}>
          Coffee can be a <span className="ally">powerful ally</span><br/>
          for your mind and body.
        </p>
      </div>

      {/* Scene 2: Benefits - Energy, Focus, Mood */}
      <div className={`scene coffee-scene-2 ${currentScene === 2 ? 'active' : ''}`}>
        <div className="energy-pulse"></div>
        <div className="benefit-cards">
          <div className={`benefit-card ${currentScene === 2 ? 'reveal' : ''}`}>
            <span className="benefit-word">Energy</span>
          </div>
          <div className={`benefit-card ${currentScene === 2 ? 'reveal' : ''}`}>
            <span className="benefit-word">Focus</span>
          </div>
          <div className={`benefit-card ${currentScene === 2 ? 'reveal' : ''}`}>
            <span className="benefit-word">Mood</span>
          </div>
        </div>
      </div>

      {/* Scene 3: More Benefits - Antioxidants, Aging, Cognitive */}
      <div className={`scene coffee-scene-3 ${currentScene === 3 ? 'active' : ''}`}>
        <div className="molecule-float">
          <div className="molecule m-1"></div>
          <div className="molecule m-2"></div>
          <div className="molecule m-3"></div>
        </div>
        <div className="deep-benefits">
          <span className={`deep-benefit ${currentScene === 3 ? 'reveal' : ''}`}>Rich in antioxidants</span>
          <span className={`deep-benefit ${currentScene === 3 ? 'reveal' : ''}`}>Promotes healthy aging</span>
          <span className={`deep-benefit ${currentScene === 3 ? 'reveal' : ''}`}>Boosts cognitive health</span>
        </div>
      </div>

      {/* Scene 4: Warning Transition */}
      <div className={`scene coffee-scene-4 ${currentScene === 4 ? 'active' : ''}`}>
        <div className="warning-flash"></div>
        <p className={`warning-text ${currentScene === 4 ? 'reveal' : ''}`}>
          But <span className="too-much">too much</span> caffeine<br/>
          works against you.
        </p>
      </div>

      {/* Scene 5: Downsides */}
      <div className={`scene coffee-scene-5 ${currentScene === 5 ? 'active' : ''}`}>
        <div className="jitter-effect"></div>
        <div className="downside-words">
          <span className={`downside-word ${currentScene === 5 ? 'reveal' : ''}`}>Anxiety</span>
          <span className={`downside-word ${currentScene === 5 ? 'reveal' : ''}`}>Poor Sleep</span>
          <span className={`downside-word ${currentScene === 5 ? 'reveal' : ''}`}>Elevated Stress</span>
          <span className={`downside-word ${currentScene === 5 ? 'reveal' : ''}`}>Dependence</span>
        </div>
      </div>

      {/* Scene 6: Know Your Limits */}
      <div className={`scene coffee-scene-6 ${currentScene === 6 ? 'active' : ''}`}>
        <div className="balance-scale">
          <div className="scale-beam"></div>
          <div className="scale-left"></div>
          <div className="scale-right"></div>
        </div>
        <p className={`limits-text ${currentScene === 6 ? 'reveal' : ''}`}>
          Sensitivity varies —<br/>
          <span className="know">know your limits.</span>
        </p>
      </div>

      {/* Scene 7: Mindful Ritual CTA */}
      <div className={`scene coffee-scene-7 ${currentScene === 7 ? 'active' : ''}`}>
        <div className="warm-glow"></div>
        <div className="floating-beans">
          <div className="bean bean-1"></div>
          <div className="bean bean-2"></div>
          <div className="bean bean-3"></div>
        </div>
        <p className={`mindful-text ${currentScene === 7 ? 'reveal' : ''}`}>
          Used mindfully, coffee becomes<br/>
          a daily ritual that<br/>
          <span className="supports">truly supports your health.</span>
        </p>
        <div className={`coffee-cta ${currentScene === 7 ? 'reveal' : ''}`}>
          Find Your Balance
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════
function DayCounter({ isActive }: { isActive: boolean }) {
  const [day, setDay] = useState(1);

  useEffect(() => {
    if (!isActive) {
      setDay(1);
      return;
    }

    const interval = setInterval(() => {
      setDay(prev => {
        if (prev >= 21) return 21;
        return prev + 3;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isActive]);

  return <span className="day-counter">{day}</span>;
}

function ProgressDots({ isActive }: { isActive: boolean }) {
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setFilled(0);
      return;
    }

    const interval = setInterval(() => {
      setFilled(prev => {
        if (prev >= 7) return 7;
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="progress-dots">
      {[0,1,2,3,4,5,6].map(i => (
        <div key={i} className={`progress-dot ${i < filled ? 'filled' : ''}`}></div>
      ))}
    </div>
  );
}
