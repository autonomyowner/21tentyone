'use client';

import { useState } from 'react';
import { AdminHeader, MetricCard } from '@/components/admin';
import {
  useDashboardMetrics,
  usePurchases,
  useProductsWithStats,
} from '@/hooks/useConvexAdmin';

type Tab = 'payments' | 'products';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('payments');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'completed' | 'failed' | 'refunded' | undefined>();

  const { metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { purchases, pagination, isLoading: purchasesLoading } = usePurchases({
    page,
    limit: 20,
    status: statusFilter,
  });
  const { products, isLoading: productsLoading } = useProductsWithStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'pending':
        return 'bg-amber-50 text-amber-700';
      case 'failed':
        return 'bg-red-50 text-red-700';
      case 'refunded':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'payments', label: 'Payments' },
    { id: 'products', label: 'Products' },
  ];

  // Calculate totals
  const totalRevenue = products.reduce((sum, p) => sum + (p.totalRevenue || 0), 0);
  const totalSales = products.reduce((sum, p) => sum + (p.salesCount || 0), 0);

  return (
    <div className="min-h-screen">
      <AdminHeader title="Payments" subtitle="Manage payments and products" />

      <main className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Revenue"
            value={metricsLoading ? '...' : formatCurrency(metrics?.totalRevenue || 0)}
            change={metrics?.revenueGrowth || 0}
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
          <MetricCard
            title="Products"
            value={productsLoading ? '...' : products.length}
            change={0}
            changeLabel="active"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="border-b border-slate-200">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <>
              {/* Status Filter */}
              <div className="p-4 border-b border-slate-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => { setStatusFilter(undefined); setPage(1); }}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      !statusFilter ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All
                  </button>
                  {(['completed', 'pending', 'failed', 'refunded'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => { setStatusFilter(status); setPage(1); }}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors capitalize ${
                        statusFilter === status ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {purchasesLoading ? (
                <div className="p-8">
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="animate-pulse h-12 bg-slate-100 rounded-lg" />
                    ))}
                  </div>
                </div>
              ) : purchases.length > 0 ? (
                <>
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
                              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(purchase.status)}`}>
                                {purchase.status}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-sm text-slate-500">{formatDate(purchase.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between">
                      <p className="text-sm text-slate-500">
                        Page {page} of {pagination.totalPages}
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
                  {statusFilter ? `No ${statusFilter} payments found` : 'No payments yet'}
                </div>
              )}
            </>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="p-6">
              {productsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse h-48 bg-slate-100 rounded-xl" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product._id} className="border border-slate-200 rounded-xl p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                            <p className="text-sm text-slate-500">{product.slug}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            product.active ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {product.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Price</span>
                            <span className="text-sm font-semibold text-slate-900">{formatCurrency(product.price)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Sales</span>
                            <span className="text-sm font-medium text-slate-900">{product.salesCount || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Revenue</span>
                            <span className="text-sm font-medium text-slate-900">{formatCurrency(product.totalRevenue || 0)}</span>
                          </div>
                        </div>
                        {totalRevenue > 0 && (
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${((product.totalRevenue || 0) / totalRevenue) * 100}%` }}
                              />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                              {(((product.totalRevenue || 0) / totalRevenue) * 100).toFixed(1)}% of total revenue
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Total Product Revenue</p>
                        <p className="text-xs text-slate-500">{totalSales} total sales</p>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  No products yet. Add products to start selling.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
