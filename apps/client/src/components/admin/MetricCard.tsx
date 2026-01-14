'use client';

import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel?: string;
  sparklineData?: number[];
  format?: 'currency' | 'number' | 'percent';
  invertChange?: boolean;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  sparklineData,
  format = 'number',
  invertChange = false,
}: MetricCardProps) {
  const formattedValue = (() => {
    if (typeof value === 'string') return value;
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'percent':
        return `${value}%`;
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  })();

  const isPositive = invertChange ? change < 0 : change > 0;
  const chartData = sparklineData?.map((value, index) => ({ value, index })) || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{formattedValue}</p>
        </div>
        {sparklineData && sparklineData.length > 0 && (
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#22C55E' : '#EF4444'} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={isPositive ? '#22C55E' : '#EF4444'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? '#22C55E' : '#EF4444'}
                  strokeWidth={1.5}
                  fill={`url(#gradient-${title})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            isPositive
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {isPositive ? '+' : ''}
          {change}%
        </span>
        <span className="text-xs text-slate-500">{changeLabel}</span>
      </div>
    </div>
  );
}
