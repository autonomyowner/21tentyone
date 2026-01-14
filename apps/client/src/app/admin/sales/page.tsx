'use client';

import { AdminHeader, MetricCard, SalesChart } from '@/components/admin';
import { MOCK_SALES, SPARKLINE_DATA } from '@/lib/admin/mock-data';

export default function SalesPage() {
  return (
    <div className="min-h-screen">
      <AdminHeader title="Sales" subtitle="Track orders, conversions, and revenue" />

      <main className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Orders"
            value={MOCK_SALES.totalOrders}
            change={MOCK_SALES.ordersGrowth}
            changeLabel="vs last month"
          />
          <MetricCard
            title="New Orders"
            value={MOCK_SALES.newOrders}
            change={12.5}
            changeLabel="vs last month"
          />
          <MetricCard
            title="Conversion Rate"
            value={MOCK_SALES.conversionRate}
            change={0.5}
            changeLabel="vs last month"
            format="percent"
            sparklineData={SPARKLINE_DATA.conversion}
          />
          <MetricCard
            title="Avg. Order Value"
            value={MOCK_SALES.averageOrderValue}
            change={4.2}
            changeLabel="vs last month"
            format="currency"
          />
        </div>

        {/* Sales Chart */}
        <div className="mb-6">
          <SalesChart data={MOCK_SALES.salesHistory} title="Daily Orders & Revenue" />
        </div>

        {/* Sales by Plan & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Sales by Plan */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-medium text-slate-700 mb-4">Sales by Plan</h3>
            <div className="space-y-4">
              {MOCK_SALES.ordersByPlan.map((plan) => (
                <div key={plan.plan}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">{plan.plan}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-slate-900">
                        ${plan.revenue.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">
                        ({plan.count} orders)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(plan.revenue / MOCK_SALES.ordersByPlan.reduce((sum, p) => sum + p.revenue, 0)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Total Revenue</span>
                <span className="text-sm font-semibold text-slate-900">
                  ${MOCK_SALES.ordersByPlan.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-5 border-b border-slate-200">
              <h3 className="text-sm font-medium text-slate-700">Recent Orders</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { id: 'ORD-1234', customer: 'Sarah Chen', plan: 'Annual Pro', amount: 240, time: '2 mins ago' },
                { id: 'ORD-1233', customer: 'Michael Johnson', plan: 'Monthly Pro', amount: 49, time: '15 mins ago' },
                { id: 'ORD-1232', customer: 'Emma Williams', plan: 'Annual Pro', amount: 240, time: '1 hour ago' },
                { id: 'ORD-1231', customer: 'James Brown', plan: 'Lifetime', amount: 300, time: '2 hours ago' },
                { id: 'ORD-1230', customer: 'Olivia Davis', plan: 'Monthly Pro', amount: 49, time: '3 hours ago' },
              ].map((order) => (
                <div key={order.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{order.customer}</p>
                    <p className="text-xs text-slate-500">{order.id} - {order.plan}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">${order.amount}</p>
                    <p className="text-xs text-slate-500">{order.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
