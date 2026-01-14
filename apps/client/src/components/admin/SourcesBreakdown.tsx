'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Source {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface SourcesBreakdownProps {
  data: Source[];
  title?: string;
}

export function SourcesBreakdown({ data, title = 'Traffic Sources' }: SourcesBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-medium text-slate-700 mb-4">{title}</h3>
      <div className="flex items-center gap-6">
        {/* Chart */}
        <div className="w-32 h-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
                formatter={(value) => [`${value}%`, 'Share']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {data.map((source) => (
            <div key={source.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: source.color }}
                />
                <span className="text-sm text-slate-600">{source.name}</span>
              </div>
              <span className="text-sm font-medium text-slate-900">{source.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
