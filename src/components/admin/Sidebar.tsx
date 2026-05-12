"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    label: "CRM",
    items: [
      { href: "/admin", label: "Pipeline", icon: "grid", badge: "12" },
      { href: "/admin/crm/followup", label: "Suivi J+7", icon: "clock", badge: "3", badgeRed: true },
      { href: "/admin/crm", label: "Tous les clients", icon: "users" },
      { href: "/admin/crm/documents", label: "Documents", icon: "file" },
    ],
  },
  {
    label: "Facturation",
    items: [
      { href: "/admin/billing/quotes", label: "Devis Challenge", icon: "dollar" },
      { href: "/admin/billing/recovery", label: "Recouvrement", icon: "credit-card", badge: "2", badgeRed: true },
    ],
  },
  {
    label: "Réseaux sociaux",
    items: [
      { href: "/admin/social", label: "Calendrier éditorial", icon: "calendar", badge: "7" },
      { href: "/admin/social/stats", label: "Statistiques", icon: "activity" },
    ],
  },
  {
    label: "Contenu",
    items: [
      { href: "/admin/content", label: "Pages du site", icon: "edit" },
    ],
  },
];

const ICONS: Record<string, React.ReactNode> = {
  grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  clock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  file: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  dollar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  "credit-card": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  calendar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  activity: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  edit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] flex-shrink-0 bg-[var(--color-g-900)] flex flex-col overflow-y-auto">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-white/7 flex items-center gap-3">
        <Image
          src="/images/logo.png"
          alt="Hosamine"
          width={120}
          height={39}
          className="h-8 w-auto brightness-0 invert opacity-85 [clip-path:inset(0_0_0_5px)]"
        />
      </div>

      {/* Nav groups */}
      <nav className="flex-1 py-4">
        {NAV.map((group) => (
          <div key={group.label} className="px-3 mb-5">
            <p className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white/50">
              {group.label}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium mb-0.5 transition-all ${
                    active
                      ? "bg-[var(--color-g-700)] text-white"
                      : "text-white/72 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span className={`flex-shrink-0 ${active ? "opacity-100" : "opacity-70"}`}>
                    {ICONS[item.icon]}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.badgeRed
                          ? "bg-[var(--color-r-500,oklch(55%_0.18_25))] text-white"
                          : "bg-[var(--color-a-500)] text-[oklch(18%_0.08_60)]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/8 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[var(--color-g-600)] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
          H
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white/85 truncate">Hosamine Admin</p>
          <p className="text-[10px] text-white/55">Administration</p>
        </div>
        <Link href="/admin/login" className="text-white/30 hover:text-white/60 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </Link>
      </div>
    </aside>
  );
}
