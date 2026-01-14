'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RevenueChartProps {
  data: { month: string; value: number }[];
  title?: string;
}

export function RevenueChart({ data, title = 'Revenue Trend' }: RevenueChartProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-medium text-slate-700 mb-4">{title}</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              tickFormatter={(value) => `$${value / 1000}k`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              labelStyle={{ color: '#94A3B8', fontSize: 12, marginBottom: 4 }}
              itemStyle={{ color: '#FFFFFF', fontSize: 14, fontWeight: 500 }}
              formatter={(value) => [formatCurrency(value as number), 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
