'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/revenue', label: 'Revenue' },
  { href: '/admin/sales', label: 'Sales' },
  { href: '/admin/payments', label: 'Payments' },
  { href: '/admin/traffic', label: 'Traffic' },
  { href: '/admin/funnel', label: 'Funnel' },
  { href: '/admin/users', label: 'Users' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-slate-200 flex flex-col z-50">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <Link href="/admin" className="text-lg font-semibold text-slate-900">
          21|Twenty One
        </Link>
        <span className="ml-2 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center h-10 px-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-3 ${
                  isActive(item.href) ? 'bg-blue-500' : 'bg-slate-300'
                }`}
              />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">Admin User</p>
            <p className="text-xs text-slate-500 truncate">admin@t21.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
