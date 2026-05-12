"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CRMClient } from "@/lib/db/types";

export default function RecoveryPage() {
  const [clients, setClients] = useState<CRMClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crm/clients")
      .then((r) => r.json())
      .then((data: CRMClient[]) => {
        setClients(data.filter((c) => c.stage === "recovery" && (c.quote_amount ?? 0) > c.advance_paid));
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPending = clients.reduce(
    (sum, c) => sum + ((c.quote_amount ?? 0) - c.advance_paid),
    0
  );

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-3 flex-shrink-0">
        <span className="font-[var(--font-display)] text-base font-semibold" style={{ color: "var(--color-text)" }}>
          Recouvrement
        </span>
        {!loading && clients.length > 0 && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700">
            {totalPending.toLocaleString("fr-FR")} XAF en attente
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-sm text-center mt-16" style={{ color: "var(--color-text-3)" }}>Chargement...</p>
        ) : clients.length === 0 ? (
          <div className="text-center mt-16">
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>Aucun recouvrement en cours</p>
            <p className="text-xs" style={{ color: "var(--color-text-3)" }}>Tous les clients sont à jour.</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-3">
            {clients.map((client) => {
              const balance = (client.quote_amount ?? 0) - client.advance_paid;
              const dueDate = client.service_date
                ? new Date(
                    new Date(client.service_date).getTime() +
                      (client.recovery_delay ?? 30) * 86_400_000
                  )
                : null;
              const isOverdue = dueDate && dueDate < new Date();

              return (
                <div
                  key={client.id}
                  className="bg-white rounded-xl border border-[var(--color-border)] p-4 flex items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/crm/${client.id}`}
                      className="text-sm font-semibold hover:underline"
                      style={{ color: "var(--color-text)" }}
                    >
                      {client.full_name}
                    </Link>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-3)" }}>
                      {client.sector ?? "—"} · Réf. {client.quote_ref ?? "—"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold" style={{ color: "var(--color-a-600)" }}>
                      {balance.toLocaleString("fr-FR")} XAF
                    </p>
                    {dueDate && (
                      <p className={`text-[10px] font-semibold ${isOverdue ? "text-red-600" : "text-[var(--color-text-3)]"}`}>
                        Échéance {dueDate.toLocaleDateString("fr-FR")}{isOverdue ? " · EN RETARD" : ""}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/admin/crm/${client.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--color-border)] hover:bg-[var(--color-g-50)] transition-colors flex-shrink-0"
                    style={{ color: "var(--color-text-2)" }}
                  >
                    Détails →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
