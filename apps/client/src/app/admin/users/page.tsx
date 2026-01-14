'use client';

import { AdminHeader, MetricCard, UsersTable } from '@/components/admin';
import { MOCK_USERS, MOCK_USER_METRICS } from '@/lib/admin/mock-data';

export default function UsersPage() {
  return (
    <div className="min-h-screen">
      <AdminHeader title="Users" subtitle="Manage your customers and track engagement" />

      <main className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Users"
            value={MOCK_USER_METRICS.totalUsers}
            change={MOCK_USER_METRICS.userGrowthRate}
            changeLabel="vs last month"
          />
          <MetricCard
            title="Active Users"
            value={MOCK_USER_METRICS.activeUsers}
            change={10.2}
            changeLabel="vs last month"
          />
          <MetricCard
            title="Paid Customers"
            value={737}
            change={8.5}
            changeLabel="vs last month"
          />
          <MetricCard
            title="Retention Rate"
            value={MOCK_USER_METRICS.retentionRate}
            change={2.1}
            changeLabel="vs last month"
            format="percent"
          />
        </div>

        {/* Users Table */}
        <UsersTable users={MOCK_USERS} />
      </main>
    </div>
  );
}
