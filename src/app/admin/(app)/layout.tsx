import AdminSidebar from "@/components/admin/Sidebar";

// Protected admin area — adds the sidebar to all child routes.
export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-g-50)]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
