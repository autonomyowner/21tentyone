'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useLanguage } from '../../components/LanguageProvider';
import { api, CyclePhase, CyclePhaseData, CalendarDay, CycleInsight, CYCLE_PHASE_INFO } from '../../lib/api';
import { PeriodLogModal } from '../../components/cycle';

export default function CyclePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { t, language } = useLanguage();

  const [currentPhase, setCurrentPhase] = useState<CyclePhaseData | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [insights, setInsights] = useState<CycleInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Modal state
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [hasOpenPeriod, setHasOpenPeriod] = useState(false);

  // Daily log state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dailyLog, setDailyLog] = useState({
    energy: 3,
    mood: 3,
    anxiety: 3,
    notes: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      setIsLoading(true);
      setError(null);

      const [phaseData, calendarData, insightsData] = await Promise.all([
        api.getCurrentCyclePhase(token),
        api.getCycleCalendar(token, currentYear, currentMonth),
        api.getCycleInsights(token),
      ]);

      if ('isTracking' in phaseData && phaseData.isTracking) {
        setCurrentPhase(phaseData as CyclePhaseData);
      } else {
        setCurrentPhase(null);
      }

      setCalendarDays(calendarData.days);
      setInsights(insightsData);
    } catch (err) {
      setError('Failed to load cycle data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, currentYear, currentMonth]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/login');
      return;
    }

    if (isLoaded && isSignedIn) {
      fetchData();
    }
  }, [isLoaded, isSignedIn, router, fetchData]);

  const handleLogPeriodStart = async (date: string) => {
    const token = await getToken();
    if (!token) return;
    await api.startPeriod(token, date);
    setHasOpenPeriod(true);
    fetchData();
  };

  const handleLogPeriodEnd = async (date: string) => {
    const token = await getToken();
    if (!token) return;
    await api.endPeriod(token, date);
    setHasOpenPeriod(false);
    fetchData();
  };

  const handleSaveDailyLog = async () => {
    if (!selectedDate) return;
    const token = await getToken();
    if (!token) return;

    try {
      await api.logCycleDay(token, {
        date: selectedDate,
        energy: dailyLog.energy,
        mood: dailyLog.mood,
        anxiety: dailyLog.anxiety,
        notes: dailyLog.notes || undefined,
      });
      setSelectedDate(null);
      fetchData();
    } catch (err) {
      console.error('Failed to save daily log:', err);
    }
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 2, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth, 1));
  };

  const monthName = currentDate.toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { month: 'long', year: 'numeric' });

  // Get day names
  const dayNames = language === 'en'
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  // Get start day of month
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream-50)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream-50)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl mb-2"
              style={{
                fontFamily: 'var(--font-dm-serif), Georgia, serif',
                color: 'var(--text-primary)',
              }}
            >
              {language === 'en' ? 'Cycle Tracking' : 'Suivi du Cycle'}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {language === 'en'
                ? 'Track your cycle to understand your emotional patterns'
                : 'Suivez votre cycle pour comprendre vos schémas émotionnels'}
            </p>
          </div>
          <button
            onClick={() => setShowPeriodModal(true)}
            className="px-4 py-2 rounded-xl font-medium transition-colors"
            style={{ background: 'var(--matcha-500)', color: 'white' }}
          >
            {language === 'en' ? 'Log Period' : 'Enregistrer les règles'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(229, 115, 115, 0.1)', color: '#E57373' }}>
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Phase Card */}
          <div className="lg:col-span-1">
            <div
              className="rounded-3xl p-6"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}
            >
              <h2
                className="text-xl mb-4"
                style={{ fontFamily: 'var(--font-dm-serif), Georgia, serif', color: 'var(--text-primary)' }}
              >
                {language === 'en' ? 'Current Phase' : 'Phase Actuelle'}
              </h2>

              {currentPhase ? (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: `${CYCLE_PHASE_INFO[currentPhase.phase].color}20` }}
                    >
                      <div
                        className="w-10 h-10 rounded-full"
                        style={{ background: CYCLE_PHASE_INFO[currentPhase.phase].color }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-xl" style={{ color: 'var(--text-primary)' }}>
                        {CYCLE_PHASE_INFO[currentPhase.phase].label}
                      </div>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        Day {currentPhase.cycleDay}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {language === 'en' ? 'Next phase in' : 'Prochaine phase dans'}
                      </span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {currentPhase.daysUntilNextPhase} {language === 'en' ? 'days' : 'jours'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {language === 'en' ? 'Predicted next period' : 'Prochaines règles prévues'}
                      </span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {new Date(currentPhase.predictedNextPeriod).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {currentPhase.recommendations && (
                    <div className="pt-4 border-t" style={{ borderColor: 'var(--border-soft)' }}>
                      <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        {currentPhase.recommendations.title}
                      </h3>
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        {currentPhase.recommendations.description}
                      </p>
                      <ul className="space-y-2">
                        {currentPhase.recommendations.tips.slice(0, 2).map((tip, i) => (
                          <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--text-secondary)' }}>
                            <span style={{ color: CYCLE_PHASE_INFO[currentPhase.phase].color }}>•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {language === 'en'
                      ? 'Start tracking by logging your first period'
                      : 'Commencez le suivi en enregistrant vos premières règles'}
                  </p>
                  <button
                    onClick={() => setShowPeriodModal(true)}
                    className="px-4 py-2 rounded-xl font-medium"
                    style={{ background: 'var(--matcha-500)', color: 'white' }}
                  >
                    {language === 'en' ? 'Log First Period' : 'Enregistrer les premières règles'}
                  </button>
                </div>
              )}
            </div>

            {/* Insights */}
            {insights.length > 0 && (
              <div
                className="mt-6 rounded-3xl p-6"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}
              >
                <h2
                  className="text-xl mb-4"
                  style={{ fontFamily: 'var(--font-dm-serif), Georgia, serif', color: 'var(--text-primary)' }}
                >
                  {language === 'en' ? 'Your Insights' : 'Vos Insights'}
                </h2>
                <div className="space-y-4">
                  {insights.slice(0, 3).map((insight) => (
                    <div
                      key={insight.id}
                      className="p-3 rounded-xl"
                      style={{ background: 'var(--cream-100)' }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: CYCLE_PHASE_INFO[insight.phase].color }}
                        />
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {insight.title}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {insight.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Calendar */}
          <div className="lg:col-span-2">
            <div
              className="rounded-3xl p-6"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={goToPrevMonth}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  ←
                </button>
                <h2
                  className="text-xl capitalize"
                  style={{ fontFamily: 'var(--font-dm-serif), Georgia, serif', color: 'var(--text-primary)' }}
                >
                  {monthName}
                </h2>
                <button
                  onClick={goToNextMonth}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  →
                </button>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium py-2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month start */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Calendar days */}
                {calendarDays.map((day) => {
                  const dayNum = new Date(day.date).getDate();
                  const isToday = day.date === new Date().toISOString().split('T')[0];
                  const phaseInfo = day.phase ? CYCLE_PHASE_INFO[day.phase] : null;

                  return (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDate(day.date)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                        isToday ? 'ring-2' : ''
                      }`}
                      style={{
                        background: day.isPeriod
                          ? 'rgba(229, 115, 115, 0.3)'
                          : phaseInfo
                          ? `${phaseInfo.color}15`
                          : 'transparent',
                        ringColor: isToday ? 'var(--matcha-500)' : undefined,
                        opacity: day.isPrediction ? 0.6 : 1,
                      }}
                    >
                      <span
                        className={`text-sm ${isToday ? 'font-bold' : ''}`}
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {dayNum}
                      </span>
                      {phaseInfo && (
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-0.5"
                          style={{ background: phaseInfo.color }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ background: 'rgba(229, 115, 115, 0.3)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {language === 'en' ? 'Period' : 'Règles'}
                  </span>
                </div>
                {Object.entries(CYCLE_PHASE_INFO).map(([phase, info]) => (
                  <div key={phase} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ background: `${info.color}40` }} />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{info.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Log Modal */}
        {selectedDate && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => setSelectedDate(null)}
          >
            <div
              className="w-full max-w-md rounded-3xl p-6"
              style={{ background: 'var(--bg-card)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                {language === 'en' ? 'Log for' : 'Journée du'} {new Date(selectedDate).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { month: 'short', day: 'numeric' })}
              </h2>

              <div className="space-y-4">
                {/* Energy slider */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {language === 'en' ? 'Energy Level' : 'Niveau d\'énergie'}: {dailyLog.energy}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={dailyLog.energy}
                    onChange={(e) => setDailyLog({ ...dailyLog, energy: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Mood slider */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {language === 'en' ? 'Mood' : 'Humeur'}: {dailyLog.mood}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={dailyLog.mood}
                    onChange={(e) => setDailyLog({ ...dailyLog, mood: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Anxiety slider */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {language === 'en' ? 'Anxiety Level' : 'Niveau d\'anxiété'}: {dailyLog.anxiety}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={dailyLog.anxiety}
                    onChange={(e) => setDailyLog({ ...dailyLog, anxiety: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {language === 'en' ? 'Notes' : 'Notes'}
                  </label>
                  <textarea
                    value={dailyLog.notes}
                    onChange={(e) => setDailyLog({ ...dailyLog, notes: e.target.value })}
                    placeholder={language === 'en' ? 'How are you feeling today?' : 'Comment vous sentez-vous aujourd\'hui ?'}
                    className="w-full px-4 py-3 rounded-xl border resize-none"
                    style={{
                      background: 'var(--bg-secondary)',
                      borderColor: 'var(--border-soft)',
                      color: 'var(--text-primary)',
                    }}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedDate(null)}
                  className="flex-1 py-3 rounded-xl font-medium"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                >
                  {language === 'en' ? 'Cancel' : 'Annuler'}
                </button>
                <button
                  onClick={handleSaveDailyLog}
                  className="flex-1 py-3 rounded-xl font-medium"
                  style={{ background: 'var(--matcha-500)', color: 'white' }}
                >
                  {language === 'en' ? 'Save' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Period Log Modal */}
        <PeriodLogModal
          isOpen={showPeriodModal}
          onClose={() => setShowPeriodModal(false)}
          onLogStart={handleLogPeriodStart}
          onLogEnd={handleLogPeriodEnd}
          hasOpenPeriod={hasOpenPeriod}
        />
      </div>
    </div>
  );
}
