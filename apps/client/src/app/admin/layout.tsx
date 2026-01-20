'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebar } from '@/components/admin';
import { useAdminAuth } from '@/hooks/useConvexAdmin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();

  // Don't require auth for login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  // Show loading state
  if (isLoading && !isLoginPage) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: '#F8FAFC',
        }}
      >
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  // Login page - render without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Not authenticated - show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated - render with sidebar
  return (
    <div
      className="min-h-screen"
      style={{
        background: '#F8FAFC',
        color: '#0F172A',
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
        position: 'relative',
      }}
    >
      <AdminSidebar />
      <div className="ml-[260px] min-h-screen">{children}</div>
    </div>
  );
}
