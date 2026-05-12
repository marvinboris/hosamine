"use client";

import { useEffect, useState } from "react";
import CRMPipeline from "@/components/admin/CRMPipeline";

interface Stats {
  activeClients: number;
  overdueFollowups: number;
  recoveryAmount: number;
  scheduledPosts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  return (
    <>
      <div className="px-6 py-3 border-b border-[var(--color-border)] bg-white flex items-center gap-4 flex-shrink-0">
        {[
          {
            label: "Clients actifs",
            value: stats?.activeClients ?? "—",
            color: "text-[var(--color-g-700)]",
          },
          {
            label: "Suivis en retard",
            value: stats?.overdueFollowups ?? "—",
            color: stats?.overdueFollowups ? "text-red-600" : "text-[var(--color-text-2)]",
          },
          {
            label: "À recouvrer (XAF)",
            value: stats?.recoveryAmount != null
              ? stats.recoveryAmount.toLocaleString("fr-FR")
              : "—",
            color: stats?.recoveryAmount ? "text-amber-600" : "text-[var(--color-text-2)]",
          },
          {
            label: "Posts planifiés",
            value: stats?.scheduledPosts ?? "—",
            color: "text-[var(--color-text-2)]",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2 pr-4 border-r border-[var(--color-border)] last:border-0 last:pr-0">
            <span className={`text-sm font-bold tabular-nums ${color}`}>{value}</span>
            <span className="text-[11px]" style={{ color: "var(--color-text-3)" }}>{label}</span>
          </div>
        ))}
      </div>
      <CRMPipeline />
    </>
  );
}
