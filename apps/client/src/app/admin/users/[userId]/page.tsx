'use client';

import Link from 'next/link';
import { AdminHeader } from '@/components/admin';

export default function UserDetailPage() {
  return (
    <div className="min-h-screen">
      <AdminHeader title="Customer Details" subtitle="View customer information" />

      <main className="p-6">
        <Link
          href="/admin/users"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <span className="mr-1">←</span> Back to Customers
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Coming Soon</h3>
          <p className="text-slate-500">
            Detailed customer profiles will be available in a future update.
          </p>
        </div>
      </main>
    </div>
  );
}
