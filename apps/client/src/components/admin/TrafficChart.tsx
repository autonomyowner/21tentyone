'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrafficChartProps {
  data: { date: string; views: number; sessions: number }[];
  title?: string;
}

export function TrafficChart({ data, title = 'Traffic Overview' }: TrafficChartProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-medium text-slate-700 mb-4">{title}</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              dy={10}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              tickFormatter={(value) => `${value / 1000}k`}
              dx={-10}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              tickFormatter={(value) => `${value / 1000}k`}
              dx={10}
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
                if (name === 'views') return [formatted, 'Page Views'];
                return [formatted, 'Sessions'];
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="views"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3B82F6' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="sessions"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#8B5CF6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-xs text-slate-600">Page Views</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-purple-500" />
          <span className="text-xs text-slate-600">Sessions</span>
        </div>
      </div>
    </div>
  );
}
