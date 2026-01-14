'use client';

import { AdminHeader, MetricCard, RevenueChart } from '@/components/admin';
import { MOCK_REVENUE, SPARKLINE_DATA } from '@/lib/admin/mock-data';

export default function RevenuePage() {
  return (
    <div className="min-h-screen">
      <AdminHeader title="Revenue" subtitle="Track your recurring revenue and growth" />

      <main className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Monthly Recurring Revenue"
            value={MOCK_REVENUE.mrr}
            change={MOCK_REVENUE.mrrGrowth}
            changeLabel="vs last month"
            sparklineData={SPARKLINE_DATA.mrr}
            format="currency"
          />
          <MetricCard
            title="Annual Recurring Revenue"
            value={MOCK_REVENUE.arr}
            change={MOCK_REVENUE.mrrGrowth}
            changeLabel="vs last month"
            format="currency"
          />
          <MetricCard
            title="Lifetime Value"
            value={MOCK_REVENUE.ltv}
            change={5.2}
            changeLabel="vs last month"
            format="currency"
          />
          <MetricCard
            title="ARPU"
            value={MOCK_REVENUE.arpu}
            change={3.1}
            changeLabel="vs last month"
            format="currency"
          />
        </div>

        {/* Revenue Chart */}
        <div className="mb-6">
          <RevenueChart data={MOCK_REVENUE.mrrHistory} title="MRR Growth Over Time" />
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-medium text-slate-700 mb-4">Revenue Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-sm text-slate-600">New Subscriptions</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">$4,250</p>
                  <p className="text-xs text-slate-500">34% of MRR</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded bg-green-500" />
                  <span className="text-sm text-slate-600">Renewals</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">$7,200</p>
                  <p className="text-xs text-slate-500">58% of MRR</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded bg-purple-500" />
                  <span className="text-sm text-slate-600">Upgrades</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">$1,000</p>
                  <p className="text-xs text-slate-500">8% of MRR</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-medium text-slate-700 mb-4">Churn Analysis</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Churn Rate</span>
                <span className="text-sm font-medium text-slate-900">{MOCK_REVENUE.churnRate}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${MOCK_REVENUE.churnRate * 10}%` }}
                />
              </div>
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Churned Revenue</span>
                  <span className="text-sm font-medium text-red-600">-$398</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Churned Users</span>
                  <span className="text-sm font-medium text-slate-900">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Table */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-sm font-medium text-slate-700">Monthly Revenue History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Month
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    MRR
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Growth
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    New
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Churned
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_REVENUE.mrrHistory.slice().reverse().map((row, index, arr) => {
                  const prevMrr = arr[index + 1]?.value || row.value;
                  const growth = ((row.value - prevMrr) / prevMrr * 100).toFixed(1);
                  return (
                    <tr key={row.month} className="border-b border-slate-100">
                      <td className="px-5 py-3 text-sm text-slate-900">{row.month} 2024</td>
                      <td className="px-5 py-3 text-sm text-slate-900 text-right font-medium">
                        ${row.value.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-sm text-right">
                        <span className={parseFloat(growth) >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {parseFloat(growth) >= 0 ? '+' : ''}{growth}%
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-600 text-right">
                        ${Math.round(row.value * 0.15).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-sm text-red-600 text-right">
                        -${Math.round(row.value * 0.03).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
