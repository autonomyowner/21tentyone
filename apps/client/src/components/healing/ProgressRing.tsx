'use client';

import { useEffect, useState } from 'react';

interface ProgressRingProps {
  currentDay: number;
  totalDays?: number;
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({
  currentDay,
  totalDays = 21,
  size = 200,
  strokeWidth = 14,
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(currentDay / totalDays, 1);
  const strokeDashoffset = circumference - (animatedProgress * circumference);

  // Milestone positions (0-1)
  const milestones = [7, 14, 21].map(day => ({
    day,
    angle: ((day / totalDays) * 360) - 90, // Start from top
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const getMilestonePosition = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const x = size / 2 + (radius - strokeWidth / 2 - 8) * Math.cos(rad);
    const y = size / 2 + (radius - strokeWidth / 2 - 8) * Math.sin(rad);
    return { x, y };
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a2e4a" />
            <stop offset="50%" stopColor="#2d5a8a" />
            <stop offset="100%" stopColor="#d4a039" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(26, 46, 74, 0.12)"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          filter="url(#glow)"
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />

        {/* Milestone markers */}
        {milestones.map(({ day, angle }) => {
          const { x, y } = getMilestonePosition(angle);
          const isReached = currentDay >= day;
          return (
            <circle
              key={day}
              cx={x}
              cy={y}
              r={day === 21 ? 8 : 6}
              fill={isReached ? '#d4a039' : 'rgba(26, 46, 74, 0.2)'}
              stroke={isReached ? '#fff' : 'transparent'}
              strokeWidth={2}
              style={{
                transition: 'fill 0.5s ease, stroke 0.5s ease',
                transform: 'rotate(90deg)',
                transformOrigin: `${x}px ${y}px`,
              }}
            />
          );
        })}
      </svg>

      {/* Center content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ transform: 'translateY(-4px)' }}
      >
        <span
          className="heading-serif text-6xl font-medium"
          style={{ color: '#1a2e4a', lineHeight: 1 }}
        >
          {currentDay}
        </span>
        <span
          className="text-sm tracking-widest uppercase mt-1"
          style={{ color: '#2d5a8a' }}
        >
          of {totalDays}
        </span>
      </div>

      {/* Subtle outer glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, transparent 60%, rgba(26, 46, 74, 0.03) 100%)',
        }}
      />
    </div>
  );
}
