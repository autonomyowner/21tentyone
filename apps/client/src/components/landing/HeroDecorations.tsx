'use client';

import { useEffect, useState } from 'react';
import { PaintSplatter, GoldRect, GrainOverlay } from './Decorations';

export default function HeroDecorations() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <GrainOverlay />

      {/* Animated Paint Splatters */}
      <PaintSplatter
        className="w-[500px] h-[500px] -top-20 -left-32 paint-expand"
        color="rgba(157, 67, 58, 0.12)"
        delay={300}
        scale={1}
      />
      <PaintSplatter
        className="w-[400px] h-[400px] -bottom-20 -right-16 paint-expand"
        color="rgba(129, 53, 46, 0.1)"
        delay={600}
        scale={0.9}
      />
      <PaintSplatter
        className="w-[300px] h-[300px] top-1/3 right-1/4 paint-expand"
        color="rgba(230, 200, 195, 0.08)"
        delay={900}
        scale={0.7}
      />

      {/* Floating Gold Rectangles */}
      <GoldRect className="top-[20%] left-[8%]" size="md" delay={0.5} />
      <GoldRect className="top-[30%] right-[12%]" size="lg" delay={1} />
      <GoldRect className="bottom-[25%] left-[15%]" size="sm" delay={1.5} />
      <GoldRect className="bottom-[35%] right-[20%]" size="md" delay={2} />
    </>
  );
}
