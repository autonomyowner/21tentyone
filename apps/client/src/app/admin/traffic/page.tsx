'use client';

import { AdminHeader, MetricCard, TrafficChart, SourcesBreakdown } from '@/components/admin';
import { MOCK_TRAFFIC } from '@/lib/admin/mock-data';

export default function TrafficPage() {
  return (
    <div className="min-h-screen">
      <AdminHeader title="Traffic" subtitle="Analyze your website traffic and sources" />

      <main className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Page Views"
            value={MOCK_TRAFFIC.pageViews}
            change={MOCK_TRAFFIC.pageViewsGrowth}
            changeLabel="vs last period"
          />
          <MetricCard
            title="Sessions"
            value={MOCK_TRAFFIC.sessions}
            change={11.8}
            changeLabel="vs last period"
          />
          <MetricCard
            title="Unique Visitors"
            value={MOCK_TRAFFIC.uniqueVisitors}
            change={9.5}
            changeLabel="vs last period"
          />
          <MetricCard
            title="Bounce Rate"
            value={MOCK_TRAFFIC.bounceRate}
            change={-2.3}
            changeLabel="vs last period"
            format="percent"
            invertChange
          />
        </div>

        {/* Traffic Chart & Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <TrafficChart data={MOCK_TRAFFIC.trafficHistory} title="Traffic Over Time" />
          </div>
          <SourcesBreakdown data={MOCK_TRAFFIC.sources} />
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-sm font-medium text-slate-700">Top Pages</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Page
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Views
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Avg. Time
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TRAFFIC.topPages.map((page) => (
                  <tr key={page.path} className="border-b border-slate-100">
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-blue-600">{page.path}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-900 text-right">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 text-right">
                      {page.avgTime}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(page.views / MOCK_TRAFFIC.pageViews) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-600 w-12 text-right">
                          {((page.views / MOCK_TRAFFIC.pageViews) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
