'use client';

import { AdminHeader } from '@/components/admin';

export default function RevenuePage() {
  return (
    <div className="min-h-screen">
      <AdminHeader title="Revenue" subtitle="Track your recurring revenue and growth" />

      <main className="p-6">
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Coming Soon</h3>
          <p className="text-slate-500">
            Revenue analytics will be available once you have sales data.
          </p>
        </div>
      </main>
    </div>
  );
}
