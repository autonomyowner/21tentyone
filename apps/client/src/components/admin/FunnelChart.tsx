'use client';

import type { FunnelMetrics } from '@/lib/admin/types';

interface FunnelChartProps {
  data: FunnelMetrics;
  title?: string;
  compact?: boolean;
}

export function FunnelChart({ data, title = 'Conversion Funnel', compact = false }: FunnelChartProps) {
  const stages = [
    { label: 'Visitors', value: data.visitors, rate: 100, color: '#3B82F6' },
    { label: 'Signups', value: data.signups, rate: data.signupRate, color: '#8B5CF6' },
    { label: 'Trials', value: data.trials, rate: data.trialRate, color: '#F59E0B' },
    { label: 'Paid', value: data.paid, rate: data.paidRate, color: '#22C55E' },
  ];

  const maxValue = stages[0].value;

  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-medium text-slate-700 mb-4">{title}</h3>
        <div className="space-y-3">
          {stages.map((stage, index) => {
            const width = (stage.value / maxValue) * 100;
            return (
              <div key={stage.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{stage.label}</span>
                  <span className="text-xs font-medium text-slate-900">
                    {new Intl.NumberFormat('en-US').format(stage.value)}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${width}%`, backgroundColor: stage.color }}
                  />
                </div>
                {index < stages.length - 1 && (
                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] text-slate-400">
                      {stages[index + 1].rate}% conversion
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">Overall Conversion</span>
            <span className="text-sm font-semibold text-green-600">{data.overallConversion}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-sm font-medium text-slate-700 mb-6">{title}</h3>
      <div className="flex items-end justify-center gap-2 h-[300px]">
        {stages.map((stage, index) => {
          const width = 60 + (3 - index) * 30;
          const height = (stage.value / maxValue) * 100;

          return (
            <div key={stage.label} className="flex flex-col items-center">
              <div
                className="relative rounded-t-lg transition-all duration-500 hover:opacity-80"
                style={{
                  width: `${width}px`,
                  height: `${height}%`,
                  backgroundColor: stage.color,
                  minHeight: '40px',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {new Intl.NumberFormat('en-US').format(stage.value)}
                  </span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm font-medium text-slate-700">{stage.label}</p>
                {index > 0 && (
                  <p className="text-xs text-slate-500">{stage.rate}% rate</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{data.overallConversion}%</p>
            <p className="text-xs text-slate-500">Overall Conversion</p>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{data.signupRate}%</p>
            <p className="text-xs text-slate-500">Visitor to Signup</p>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{data.paidRate}%</p>
            <p className="text-xs text-slate-500">Trial to Paid</p>
          </div>
        </div>
      </div>
    </div>
  );
}
