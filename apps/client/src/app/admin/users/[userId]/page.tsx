'use client';

import { use } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin';
import { MOCK_USERS } from '@/lib/admin/mock-data';

export default function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const user = MOCK_USERS.find((u) => u.id === userId);

  if (!user) {
    return (
      <div className="min-h-screen">
        <AdminHeader title="User Not Found" />
        <main className="p-6">
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <p className="text-slate-600 mb-4">The user you're looking for doesn't exist.</p>
            <Link
              href="/admin/users"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Users
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title={`${user.firstName} ${user.lastName}`}
        subtitle={user.email}
      />

      <main className="p-6">
        {/* Back Link */}
        <Link
          href="/admin/users"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <span className="mr-1">←</span> Back to Users
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-semibold text-slate-600">
                {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Status</span>
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                    user.status === 'active'
                      ? 'text-green-600'
                      : user.status === 'churned'
                      ? 'text-red-600'
                      : 'text-slate-500'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-500'
                        : user.status === 'churned'
                        ? 'bg-red-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Product</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    user.lifetimeValue >= 27
                      ? 'bg-blue-50 text-blue-700'
                      : user.lifetimeValue >= 9
                      ? 'bg-purple-50 text-purple-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {user.lifetimeValue >= 27 ? '21-Day Protocol' : user.lifetimeValue >= 9 ? 'Premium PDF' : 'Free PDF'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Joined</span>
                <span className="text-sm text-slate-900">{formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Last Active</span>
                <span className="text-sm text-slate-900">{formatDate(user.lastActiveAt)}</span>
              </div>
            </div>
          </div>

          {/* Stats & Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500 mb-1">Lifetime Value</p>
                <p className="text-xl font-semibold text-slate-900">€{user.lifetimeValue}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500 mb-1">Total Sessions</p>
                <p className="text-xl font-semibold text-slate-900">{user.totalSessions}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500 mb-1">Day Progress</p>
                <p className="text-xl font-semibold text-slate-900">{user.dayCompleted}/21</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500 mb-1">Completion</p>
                <p className="text-xl font-semibold text-slate-900">
                  {Math.round((user.dayCompleted / 21) * 100)}%
                </p>
              </div>
            </div>

            {/* 21-Day Progress */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-medium text-slate-700 mb-4">21-Day Journey Progress</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Day {user.dayCompleted} of 21</span>
                  <span className="text-sm font-medium text-slate-900">
                    {Math.round((user.dayCompleted / 21) * 100)}% Complete
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(user.dayCompleted / 21) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 21 }, (_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-6 rounded ${
                      i < user.dayCompleted
                        ? i < 7
                          ? 'bg-blue-500'
                          : i < 14
                          ? 'bg-purple-500'
                          : 'bg-green-500'
                        : 'bg-slate-100'
                    }`}
                    title={`Day ${i + 1}`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                <span>Week 1: Awareness</span>
                <span>Week 2: Healing</span>
                <span>Week 3: Integration</span>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-medium text-slate-700 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'Completed daily check-in', time: '2 hours ago', type: 'check-in' },
                  { action: 'Finished breathing exercise', time: '3 hours ago', type: 'exercise' },
                  { action: 'Wrote journal entry', time: '1 day ago', type: 'journal' },
                  { action: 'Completed Day ' + user.dayCompleted, time: '1 day ago', type: 'milestone' },
                  { action: 'Started chat session', time: '2 days ago', type: 'chat' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'milestone'
                          ? 'bg-green-500'
                          : activity.type === 'check-in'
                          ? 'bg-blue-500'
                          : 'bg-slate-300'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
