'use client';

import { useEffect, useState } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 11,
    hours: 34,
    minutes: 12,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              days--;
              if (days < 0) {
                days = 0;
                hours = 0;
                minutes = 0;
                seconds = 0;
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 md:gap-6">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Minutes' },
        { value: timeLeft.seconds, label: 'Seconds' }
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div
            className="text-3xl md:text-5xl font-bold mb-1"
            style={{ color: 'var(--navy)', fontFamily: 'var(--font-poppins)' }}
          >
            {String(item.value).padStart(2, '0')}
          </div>
          <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--blue)', opacity: 0.7 }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
