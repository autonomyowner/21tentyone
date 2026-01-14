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

interface UserActivityChartProps {
  data: { date: string; total: number; active: number; new: number }[];
  title?: string;
}

export function UserActivityChart({ data, title = 'User Activity' }: UserActivityChartProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-medium text-slate-700 mb-4">{title}</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94A3B8' }}
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
              formatter={(value, name) => {
                const formatted = new Intl.NumberFormat('en-US').format(value as number);
                const labels: Record<string, string> = {
                  total: 'Total Users',
                  active: 'Active Users',
                  new: 'New Signups',
                };
                return [formatted, labels[name as string] || name];
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#totalGradient)"
            />
            <Area
              type="monotone"
              dataKey="active"
              stroke="#22C55E"
              strokeWidth={2}
              fill="url(#activeGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-xs text-slate-600">Total Users</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-green-500" />
          <span className="text-xs text-slate-600">Active Users</span>
        </div>
      </div>
    </div>
  );
}
