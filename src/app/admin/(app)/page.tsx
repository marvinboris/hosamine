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

  const cards = [
    {
      label: "Clients actifs",
      value: stats?.activeClients ?? "—",
      color: "var(--color-ink)",
      foot: "au pipeline",
    },
    {
      label: "Suivis en retard",
      value: stats?.overdueFollowups ?? "—",
      color: stats?.overdueFollowups ? "#dc2626" : "var(--color-ink)",
      foot: "à relancer J+7",
    },
    {
      label: "À recouvrer",
      value: stats?.recoveryAmount != null ? stats.recoveryAmount.toLocaleString("fr-FR") : "—",
      unit: "XAF",
      color: stats?.recoveryAmount ? "var(--color-a-600)" : "var(--color-ink)",
      foot: "sur devis en cours",
    },
    {
      label: "Posts planifiés",
      value: stats?.scheduledPosts ?? "—",
      color: "var(--color-ink)",
      foot: "ce mois",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[var(--color-border)] border-b border-[var(--color-border)] bg-white flex-shrink-0">
        {cards.map(({ label, value, unit, color, foot }) => (
          <div key={label} className="relative p-5 overflow-hidden">
            {/* Gradient blob (vena admin-app decorative element) */}
            <div
              className="absolute top-4 right-4 h-9 w-7 rounded-2xl opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-g-400), var(--color-brand))",
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0 2px, transparent 2px 5px)",
                }}
              />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--color-text-2)" }}>{label}</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              {unit && (
                <span className="text-sm font-light leading-none" style={{ color: "var(--color-text-3)" }}>{unit}</span>
              )}
              <span
                className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-none tabular-nums"
                style={{ color }}
              >
                {value}
              </span>
            </div>
            <div className="border-t border-[var(--color-border)] pt-2.5 mt-4">
              <p className="text-[11px]" style={{ color: "var(--color-text-3)" }}>{foot}</p>
            </div>
          </div>
        ))}
      </div>
      <CRMPipeline />
    </>
  );
}
