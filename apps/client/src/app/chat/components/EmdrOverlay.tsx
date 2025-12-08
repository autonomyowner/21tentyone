'use client';

interface EmdrOverlayProps {
  bilateralActive: boolean;
  currentSide: 'left' | 'right';
  blinkActive: boolean;
  blinkCount: number;
}

export function EmdrOverlay({
  bilateralActive,
  currentSide,
  blinkActive,
  blinkCount,
}: EmdrOverlayProps) {
  return (
    <>
      {/* Blink Ripple Effect */}
      <div className={`emdr-blink-ripple ${blinkActive ? 'active' : ''}`} key={`ripple-${blinkCount}`} />
      <div className={`emdr-blink-ripple-inner ${blinkActive ? 'active' : ''}`} key={`ripple-inner-${blinkCount}`} />

      {/* Bilateral Stimulation Indicator */}
      {bilateralActive && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50">
          <div className="bilateral-container">
            <div className="bilateral-side">
              <div className={`bilateral-circle ${currentSide === 'left' ? 'active' : ''}`} />
              <span className={`bilateral-label ${currentSide === 'left' ? 'active' : ''}`}>
                LEFT
              </span>
            </div>
            <div className="bilateral-side">
              <div className={`bilateral-circle ${currentSide === 'right' ? 'active' : ''}`} />
              <span className={`bilateral-label ${currentSide === 'right' ? 'active' : ''}`}>
                RIGHT
              </span>
            </div>
          </div>
          <p className="text-center text-sm text-[var(--text-muted)] mt-3">
            Tap your legs alternately following the circles
          </p>
        </div>
      )}
    </>
  );
}
