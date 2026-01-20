'use client';

import { AdminHeader } from '@/components/admin';

export default function TrafficPage() {
  return (
    <div className="min-h-screen">
      <AdminHeader title="Traffic" subtitle="Analyze your website traffic and sources" />

      <main className="p-6">
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Coming Soon</h3>
          <p className="text-slate-500">
            Traffic analytics will be available once Google Analytics is configured.
          </p>
        </div>
      </main>
    </div>
  );
}
