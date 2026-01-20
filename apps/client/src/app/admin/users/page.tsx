'use client';

import { useState } from 'react';
import { AdminHeader, MetricCard } from '@/components/admin';
import { useCustomers, useDashboardMetrics } from '@/hooks/useConvexAdmin';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { customers, pagination, isLoading } = useCustomers({
    page,
    limit: 20,
    search: search || undefined,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Customers" subtitle="Manage your customers" />

      <main className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            title="Total Revenue"
            value={metricsLoading ? '...' : formatCurrency(metrics?.totalRevenue || 0)}
            change={metrics?.revenueGrowth || 0}
            changeLabel="vs last period"
          />
          <MetricCard
            title="Avg. Order Value"
            value={metricsLoading ? '...' : formatCurrency(metrics?.averageOrderValue || 0)}
            change={0}
            changeLabel="all time"
          />
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search customers by email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl border border-slate-200">
          {isLoading ? (
            <div className="p-8">
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse h-12 bg-slate-100 rounded-lg" />
                ))}
              </div>
            </div>
          ) : customers.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Customer</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Purchases</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">Total Spent</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer._id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-5 py-3">
                          <p className="text-sm font-medium text-slate-900">{customer.name || 'No name'}</p>
                          <p className="text-xs text-slate-500">{customer.email}</p>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600">
                          {customer.purchaseCount || 0} purchases
                        </td>
                        <td className="px-5 py-3 text-sm font-medium text-slate-900 text-right">
                          {formatCurrency(customer.totalSpent || 0)}
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-500">
                          {formatDate(customer.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, pagination.total)} of {pagination.total} customers
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                      className="px-3 py-1 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-slate-500">
              {search ? 'No customers found matching your search' : 'No customers yet'}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
