'use client';

import { AdminHeader } from '@/components/admin';

export default function PaymentsPage() {
  return (
    <div className="min-h-screen">
      <AdminHeader title="Payments" subtitle="Manage payments and products" />

      <main className="p-6">
        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-6">
          <h2 className="text-2xl font-bold mb-2">Stripe Integration Coming Soon</h2>
          <p className="text-blue-100">
            Payment processing and product management will be available once Stripe is configured.
          </p>
        </div>

        {/* Mock Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900">€0.00</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500 mb-1">Total Purchases</p>
            <p className="text-2xl font-bold text-slate-900">0</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500 mb-1">Avg. Order Value</p>
            <p className="text-2xl font-bold text-slate-900">€0.00</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500 mb-1">Products</p>
            <p className="text-2xl font-bold text-slate-900">0</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No payments yet</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Once Stripe is configured, all your payments and transactions will appear here.
          </p>
        </div>
      </main>
    </div>
  );
}
