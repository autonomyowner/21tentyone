'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/admin';

const AUTH_KEY = 't21_admin_auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Check auth from localStorage
    const auth = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(auth === 'true');
  }, [pathname]); // Re-check on pathname change

  // Still loading
  if (isAuthenticated === null) {
    if (isLoginPage) {
      return <>{children}</>;
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  // Login page - always render
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
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
