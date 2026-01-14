'use client';

import { AdminHeader, MetricCard, FunnelChart } from '@/components/admin';
import { MOCK_FUNNEL } from '@/lib/admin/mock-data';

export default function FunnelPage() {
  return (
    <div className="min-h-screen">
      <AdminHeader title="Funnel" subtitle="Track your conversion funnel" />

      <main className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Visitors"
            value={MOCK_FUNNEL.visitors}
            change={8.5}
            changeLabel="vs last month"
          />
          <MetricCard
            title="Signups"
            value={MOCK_FUNNEL.signups}
            change={12.3}
            changeLabel="vs last month"
          />
          <MetricCard
            title="Trials Started"
            value={MOCK_FUNNEL.trials}
            change={15.2}
            changeLabel="vs last month"
          />
          <MetricCard
            title="Paid Conversions"
            value={MOCK_FUNNEL.paid}
            change={18.7}
            changeLabel="vs last month"
          />
        </div>

        {/* Full Funnel */}
        <div className="mb-6">
          <FunnelChart data={MOCK_FUNNEL} />
        </div>

        {/* Conversion Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Step-by-Step Analysis */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-medium text-slate-700 mb-4">Step-by-Step Conversion</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Visitor to Signup</span>
                  <span className="text-sm font-medium text-slate-900">{MOCK_FUNNEL.signupRate}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${MOCK_FUNNEL.signupRate}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {MOCK_FUNNEL.visitors - MOCK_FUNNEL.signups} visitors did not sign up
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Signup to Trial</span>
                  <span className="text-sm font-medium text-slate-900">{MOCK_FUNNEL.trialRate}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${MOCK_FUNNEL.trialRate}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {MOCK_FUNNEL.signups - MOCK_FUNNEL.trials} signups did not start trial
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Trial to Paid</span>
                  <span className="text-sm font-medium text-slate-900">{MOCK_FUNNEL.paidRate}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${MOCK_FUNNEL.paidRate}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {MOCK_FUNNEL.trials - MOCK_FUNNEL.paid} trials did not convert
                </p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-medium text-slate-700 mb-4">Insights</h3>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm font-medium text-green-800">Strong Trial Conversion</p>
                <p className="text-xs text-green-700 mt-1">
                  Your trial to paid rate of {MOCK_FUNNEL.paidRate}% is above industry average (35%)
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-sm font-medium text-amber-800">Signup Opportunity</p>
                <p className="text-xs text-amber-700 mt-1">
                  Consider optimizing your landing page to improve the {MOCK_FUNNEL.signupRate}% signup rate
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-800">Overall Performance</p>
                <p className="text-xs text-blue-700 mt-1">
                  {MOCK_FUNNEL.overallConversion}% end-to-end conversion is healthy for a SaaS product
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
