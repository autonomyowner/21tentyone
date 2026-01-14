'use client';

import { useState } from 'react';
import { AdminHeader, MetricCard } from '@/components/admin';
import {
  MOCK_STRIPE_METRICS,
  MOCK_STRIPE_PAYMENTS,
  MOCK_STRIPE_INVOICES,
  MOCK_STRIPE_DISPUTES,
  MOCK_SALES,
} from '@/lib/admin/mock-data';

type Tab = 'payments' | 'products' | 'invoices' | 'disputes';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('payments');

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
      case 'succeeded':
      case 'active':
      case 'paid':
      case 'won':
        return 'bg-green-50 text-green-700';
      case 'pending':
      case 'trialing':
      case 'open':
      case 'under_review':
        return 'bg-amber-50 text-amber-700';
      case 'failed':
      case 'past_due':
      case 'needs_response':
      case 'warning_needs_response':
        return 'bg-red-50 text-red-700';
      case 'refunded':
      case 'canceled':
      case 'void':
      case 'lost':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'payments', label: 'Payments', count: MOCK_STRIPE_PAYMENTS.length },
    { id: 'products', label: 'Products', count: 3 },
    { id: 'invoices', label: 'Invoices', count: MOCK_STRIPE_INVOICES.length },
    { id: 'disputes', label: 'Disputes', count: MOCK_STRIPE_DISPUTES.length },
  ];

  // Calculate totals for products
  const totalPurchases = MOCK_SALES.ordersByPlan.reduce((sum, p) => sum + p.count, 0);
  const totalRevenue = MOCK_SALES.ordersByPlan.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <div className="min-h-screen">
      <AdminHeader title="Payments" subtitle="Stripe payments and billing" />

      <main className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Revenue"
            value={`€${MOCK_STRIPE_METRICS.totalRevenue.toLocaleString()}`}
            change={12.5}
            changeLabel="vs last month"
          />
          <MetricCard
            title="Total Purchases"
            value={totalPurchases}
            change={8.2}
            changeLabel="vs last month"
          />
          <MetricCard
            title="Success Rate"
            value={MOCK_STRIPE_METRICS.successRate}
            change={0.5}
            changeLabel="vs last month"
            format="percent"
          />
          <MetricCard
            title="Avg. Transaction"
            value={`€${MOCK_STRIPE_METRICS.avgTransactionValue.toFixed(2)}`}
            change={3.1}
            changeLabel="vs last month"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Refund Rate</p>
                <p className="text-2xl font-semibold text-slate-900">{MOCK_STRIPE_METRICS.refundRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                <span className="text-amber-600 text-lg">↺</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Dispute Rate</p>
                <p className="text-2xl font-semibold text-slate-900">{MOCK_STRIPE_METRICS.disputeRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <span className="text-red-600 text-lg">!</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Customers</p>
                <p className="text-2xl font-semibold text-slate-900">{MOCK_STRIPE_METRICS.totalCustomers}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-blue-600 text-lg">@</span>
              </div>
            </div>
          </div>
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
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Payment ID</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Customer</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Product</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Method</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STRIPE_PAYMENTS.map((payment) => (
                    <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-3 text-sm font-mono text-slate-600">{payment.id.slice(0, 16)}...</td>
                      <td className="px-5 py-3">
                        <p className="text-sm font-medium text-slate-900">{payment.customerName}</p>
                        <p className="text-xs text-slate-500">{payment.customerEmail}</p>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-600">{payment.description}</td>
                      <td className="px-5 py-3 text-sm font-medium text-slate-900 text-right">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-600">{payment.paymentMethod}</td>
                      <td className="px-5 py-3 text-sm text-slate-500">{formatDate(payment.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 21-Day Protocol */}
                <div className="border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">21-Day Protocol</h3>
                      <p className="text-sm text-slate-500">Main healing program</p>
                    </div>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">Active</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Price</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-slate-900">€27</span>
                        <span className="text-xs text-slate-400 line-through ml-2">€67</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Sales</span>
                      <span className="text-sm font-medium text-slate-900">425</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Revenue</span>
                      <span className="text-sm font-medium text-slate-900">€11,475</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">80% of total revenue</p>
                  </div>
                </div>

                {/* Premium PDF */}
                <div className="border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Premium PDF Guide</h3>
                      <p className="text-sm text-slate-500">Comprehensive guide</p>
                    </div>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">Active</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Price</span>
                      <span className="text-sm font-semibold text-slate-900">€9</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Sales</span>
                      <span className="text-sm font-medium text-slate-900">312</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Revenue</span>
                      <span className="text-sm font-medium text-slate-900">€2,808</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '20%' }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">20% of total revenue</p>
                  </div>
                </div>

                {/* Free PDF */}
                <div className="border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Free PDF</h3>
                      <p className="text-sm text-slate-500">Lead magnet</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">Free</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Price</span>
                      <span className="text-sm font-semibold text-slate-900">€0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Downloads</span>
                      <span className="text-sm font-medium text-slate-900">1,850</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Conversion</span>
                      <span className="text-sm font-medium text-green-600">12.3%</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500">228 converted to paid products</p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Total Product Revenue</p>
                    <p className="text-xs text-slate-500">From all paid products</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">€{totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Invoice ID</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Customer</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Due Date</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STRIPE_INVOICES.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-3 text-sm font-mono text-slate-600">{invoice.id}</td>
                      <td className="px-5 py-3">
                        <p className="text-sm font-medium text-slate-900">{invoice.customerName}</p>
                        <p className="text-xs text-slate-500">{invoice.customerEmail}</p>
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-slate-900 text-right">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-600">
                        {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-500">{formatDate(invoice.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Disputes Tab */}
          {activeTab === 'disputes' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Dispute ID</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Customer</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Reason</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STRIPE_DISPUTES.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">
                        No disputes found
                      </td>
                    </tr>
                  ) : (
                    MOCK_STRIPE_DISPUTES.map((dispute) => (
                      <tr key={dispute.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-5 py-3 text-sm font-mono text-slate-600">{dispute.id}</td>
                        <td className="px-5 py-3 text-sm text-slate-600">{dispute.customerEmail}</td>
                        <td className="px-5 py-3 text-sm text-slate-600">{dispute.reason}</td>
                        <td className="px-5 py-3 text-sm font-medium text-slate-900 text-right">
                          {formatCurrency(dispute.amount)}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(dispute.status)}`}>
                            {dispute.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-500">{formatDate(dispute.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
