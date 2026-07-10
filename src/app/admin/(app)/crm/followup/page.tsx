"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CRMClient } from "@/lib/db/types";

export default function FollowupPage() {
  const [clients, setClients] = useState<CRMClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crm/clients")
      .then((r) => r.json())
      .then((data: CRMClient[]) => {
        const today = new Date().toISOString().slice(0, 10);
        setClients(
          data.filter(
            (c) => c.next_followup && c.next_followup <= today && c.stage !== "done"
          )
        );
      })
      .finally(() => setLoading(false));
  }, []);

  async function markCalled(clientId: string) {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 7);
    const res = await fetch(`/api/crm/clients/${clientId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ next_followup: nextDate.toISOString().slice(0, 10) }),
    });
    if (res.ok) {
      setClients((prev) => prev.filter((c) => c.id !== clientId));
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-3 flex-shrink-0">
        <span className="w-[10px] h-[34px] rounded-sm bg-[var(--color-brand)] flex-shrink-0" />
        <span className="font-[var(--font-display)] text-xl font-bold" style={{ color: "var(--color-text)" }}>
          Suivi J+7
        </span>
        {!loading && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600">
            {clients.length} en retard
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-sm text-center mt-16" style={{ color: "var(--color-text-3)" }}>Chargement...</p>
        ) : clients.length === 0 ? (
          <div className="text-center mt-16">
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>Aucun suivi en retard</p>
            <p className="text-xs" style={{ color: "var(--color-text-3)" }}>Tous les rappels sont à jour.</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-3">
            {clients.map((client) => {
              const overdueDays = client.next_followup
                ? Math.floor((Date.now() - new Date(client.next_followup).getTime()) / 86_400_000)
                : 0;
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
                      {client.contact_phone ?? "—"} · {client.sector ?? "—"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] font-bold text-red-600">
                      {overdueDays}j de retard
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--color-text-3)" }}>
                      Prévu le {client.next_followup ? new Date(client.next_followup).toLocaleDateString("fr-FR") : "—"}
                    </p>
                  </div>
                  <button
                    onClick={() => markCalled(client.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-g-600)] text-white hover:bg-[var(--color-g-700)] transition-colors flex-shrink-0"
                  >
                    Appelé ✓
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
