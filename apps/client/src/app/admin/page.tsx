'use client';

import { useState } from 'react';
import {
  AdminHeader,
  MetricCard,
  RevenueChart,
} from '@/components/admin';
import {
  useDashboardMetrics,
  useRevenue,
  useSalesByProduct,
  useRecentPurchases,
} from '@/hooks/useConvexAdmin';

export default function AdminDashboard() {
  const [revenuePeriod, setRevenuePeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const { metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { revenue, isLoading: revenueLoading } = useRevenue(revenuePeriod);
  const { sales, isLoading: salesLoading } = useSalesByProduct();
  const { purchases, isLoading: purchasesLoading } = useRecentPurchases(5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Dashboard" subtitle="Overview of your business metrics" />

      <main className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Revenue"
            value={metricsLoading ? '...' : formatCurrency(metrics?.totalRevenue || 0)}
            change={metrics?.revenueGrowth || 0}
            changeLabel="vs last period"
          />
          <MetricCard
            title="Total Customers"
            value={metricsLoading ? '...' : (metrics?.totalCustomers || 0)}
            change={metrics?.customerGrowth || 0}
            changeLabel="vs last period"
          />
          <MetricCard
            title="Total Purchases"
            value={metricsLoading ? '...' : (metrics?.totalPurchases || 0)}
            change={metrics?.purchaseGrowth || 0}
            changeLabel="vs last period"
          />
          <MetricCard
            title="Avg. Order Value"
            value={metricsLoading ? '...' : formatCurrency(metrics?.averageOrderValue || 0)}
            change={0}
            changeLabel="all time"
          />
        </div>

        {/* Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Revenue</h3>
              <div className="flex gap-2">
                {(['7d', '30d', '90d'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setRevenuePeriod(period)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      revenuePeriod === period
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            {revenueLoading ? (
              <div className="h-64 flex items-center justify-center text-slate-500">
                Loading...
              </div>
            ) : revenue?.revenueHistory && revenue.revenueHistory.length > 0 ? (
              <RevenueChart
                data={revenue.revenueHistory.map(r => ({
                  month: r.date,
                  value: r.revenue / 100
                }))}
                title=""
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">
                No revenue data yet
              </div>
            )}
          </div>

          {/* Sales by Product */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Sales by Product</h3>
            {salesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse h-16 bg-slate-100 rounded-lg" />
                ))}
              </div>
            ) : sales && sales.length > 0 ? (
              <div className="space-y-3">
                {sales.map((product) => (
                  <div key={product.productId} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900">{product.name}</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatCurrency(product.totalRevenue)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{product.salesCount} sales</span>
                      <span>{formatCurrency(product.price)} each</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
                No sales data yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Recent Purchases</h3>
          </div>
          {purchasesLoading ? (
            <div className="p-5">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse h-12 bg-slate-100 rounded-lg" />
                ))}
              </div>
            </div>
          ) : purchases && purchases.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Customer</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Product</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr key={purchase._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <p className="text-sm font-medium text-slate-900">{purchase.customerName || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{purchase.customerEmail}</p>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-600">{purchase.productName}</td>
                      <td className="px-5 py-3 text-sm font-medium text-slate-900 text-right">
                        {formatCurrency(purchase.amount)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          purchase.status === 'completed' ? 'bg-green-50 text-green-700' :
                          purchase.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                          purchase.status === 'refunded' ? 'bg-slate-100 text-slate-600' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {purchase.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-500">
                        {new Date(purchase.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              No purchases yet
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
