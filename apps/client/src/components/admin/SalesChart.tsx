'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SalesChartProps {
  data: { date: string; orders: number; revenue: number }[];
  title?: string;
}

export function SalesChart({ data, title = 'Sales Overview' }: SalesChartProps) {
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
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              dx={-10}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              tickFormatter={(value) => `$${value / 1000}k`}
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
                if (name === 'revenue') return [formatCurrency(value as number), 'Revenue'];
                return [value, 'Orders'];
              }}
            />
            <Bar yAxisId="left" dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="revenue" fill="#22C55E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-xs text-slate-600">Orders</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-green-500" />
          <span className="text-xs text-slate-600">Revenue</span>
        </div>
      </div>
    </div>
  );
}
