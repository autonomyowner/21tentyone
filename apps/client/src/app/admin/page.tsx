'use client';

import {
  AdminHeader,
  MetricCard,
  RevenueChart,
  SourcesBreakdown,
  UserActivityChart,
  FunnelChart,
} from '@/components/admin';
import {
  MOCK_REVENUE,
  MOCK_TRAFFIC,
  MOCK_FUNNEL,
  MOCK_USER_METRICS,
  QUICK_STATS,
  SPARKLINE_DATA,
} from '@/lib/admin/mock-data';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen">
      <AdminHeader title="Dashboard" subtitle="Overview of your business metrics" />

      <main className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Monthly Revenue"
            value={QUICK_STATS.mrr.value}
            change={QUICK_STATS.mrr.change}
            changeLabel={QUICK_STATS.mrr.label}
            sparklineData={SPARKLINE_DATA.mrr}
            format="currency"
          />
          <MetricCard
            title="Total Users"
            value={QUICK_STATS.users.value}
            change={QUICK_STATS.users.change}
            changeLabel={QUICK_STATS.users.label}
            sparklineData={SPARKLINE_DATA.users}
          />
          <MetricCard
            title="Conversion Rate"
            value={QUICK_STATS.conversion.value}
            change={QUICK_STATS.conversion.change}
            changeLabel={QUICK_STATS.conversion.label}
            sparklineData={SPARKLINE_DATA.conversion}
            format="percent"
          />
          <MetricCard
            title="Churn Rate"
            value={QUICK_STATS.churn.value}
            change={QUICK_STATS.churn.change}
            changeLabel={QUICK_STATS.churn.label}
            sparklineData={SPARKLINE_DATA.churn}
            format="percent"
            invertChange
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <RevenueChart data={MOCK_REVENUE.mrrHistory} title="Monthly Recurring Revenue" />
          </div>
          <SourcesBreakdown data={MOCK_TRAFFIC.sources} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <UserActivityChart data={MOCK_USER_METRICS.userGrowth} />
          </div>
          <FunnelChart data={MOCK_FUNNEL} compact />
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500 mb-1">Active Users</p>
            <p className="text-2xl font-semibold text-slate-900">
              {MOCK_USER_METRICS.activeUsers.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {MOCK_USER_METRICS.retentionRate}% retention rate
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500 mb-1">Paid Customers</p>
            <p className="text-2xl font-semibold text-slate-900">
              737
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Protocol + PDF purchases
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500 mb-1">Page Views</p>
            <p className="text-2xl font-semibold text-slate-900">
              {MOCK_TRAFFIC.pageViews.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              +{MOCK_TRAFFIC.pageViewsGrowth}% vs last period
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500 mb-1">Avg. Session</p>
            <p className="text-2xl font-semibold text-slate-900">
              {MOCK_TRAFFIC.avgSessionDuration}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {MOCK_TRAFFIC.bounceRate}% bounce rate
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
