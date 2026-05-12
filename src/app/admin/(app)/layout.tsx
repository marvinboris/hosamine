"use client";

import { useState } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-g-50)]">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile topbar */}
        <div className="flex items-center h-12 px-4 bg-[var(--color-g-900)] border-b border-white/10 flex-shrink-0 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/70 hover:text-white mr-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <Image
            src="/images/logo.png"
            alt="Hosamine"
            width={100}
            height={33}
            className="h-7 w-auto brightness-0 invert opacity-85 [clip-path:inset(0_0_0_5px)]"
          />
        </div>

        {children}
      </div>
    </div>
  );
}
