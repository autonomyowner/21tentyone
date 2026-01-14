import { AdminSidebar } from '@/components/admin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
