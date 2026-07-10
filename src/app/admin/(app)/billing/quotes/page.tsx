"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CRMClient } from "@/lib/db/types";

export default function QuotesPage() {
  const [clients, setClients] = useState<CRMClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crm/clients")
      .then((r) => r.json())
      .then((data: CRMClient[]) => setClients(data.filter((c) => c.quote_amount)))
      .finally(() => setLoading(false));
  }, []);

  const totalQuoted = clients.reduce((s, c) => s + (c.quote_amount ?? 0), 0);
  const totalAdvance = clients.reduce((s, c) => s + c.advance_paid, 0);
  const totalBalance = totalQuoted - totalAdvance;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-4 md:px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-3 flex-wrap gap-y-2 flex-shrink-0">
        <span className="w-[10px] h-[34px] rounded-sm bg-[var(--color-brand)] flex-shrink-0" />
        <span className="font-[var(--font-display)] text-xl font-bold" style={{ color: "var(--color-text)" }}>
          Devis Challenge
        </span>
        {!loading && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-g-100)]" style={{ color: "var(--color-text-3)" }}>
            {clients.length} devis
          </span>
        )}
        {!loading && (
          <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-4 sm:gap-6 text-sm flex-wrap">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--color-text-3)" }}>Total devisé</p>
              <p className="font-bold" style={{ color: "var(--color-text)" }}>{totalQuoted.toLocaleString("fr-FR")} XAF</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--color-text-3)" }}>Avances reçues</p>
              <p className="font-bold text-green-600">{totalAdvance.toLocaleString("fr-FR")} XAF</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--color-text-3)" }}>Solde restant</p>
              <p className="font-bold" style={{ color: "var(--color-a-600)" }}>{totalBalance.toLocaleString("fr-FR")} XAF</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <p className="text-sm text-center mt-16" style={{ color: "var(--color-text-3)" }}>Chargement...</p>
        ) : clients.length === 0 ? (
          <p className="text-sm text-center mt-16" style={{ color: "var(--color-text-3)" }}>Aucun devis enregistré.</p>
        ) : (
          <table className="w-full min-w-[760px] text-sm">
            <thead className="sticky top-0 bg-gray-50 border-b border-[var(--color-border)]">
              <tr>
                {["Client", "Référence", "Montant total", "Avance versée", "Solde", "Délai (j)", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-3)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {clients.map((c) => {
                const balance = (c.quote_amount ?? 0) - c.advance_paid;
                return (
                  <tr key={c.id} className="hover:bg-[var(--color-g-50)] transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-semibold" style={{ color: "var(--color-text)" }}>{c.full_name}</p>
                      <p className="text-[11px]" style={{ color: "var(--color-text-3)" }}>{c.sector ?? "—"}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs" style={{ color: "var(--color-text-2)" }}>{c.quote_ref ?? "—"}</td>
                    <td className="px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>
                      {(c.quote_amount ?? 0).toLocaleString("fr-FR")} XAF
                    </td>
                    <td className="px-5 py-3 text-green-600 font-semibold">
                      {c.advance_paid > 0 ? `${c.advance_paid.toLocaleString("fr-FR")} XAF` : "—"}
                    </td>
                    <td className="px-5 py-3 font-bold" style={{ color: balance > 0 ? "var(--color-a-600)" : "var(--color-text-3)" }}>
                      {balance > 0 ? `${balance.toLocaleString("fr-FR")} XAF` : "Soldé"}
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: "var(--color-text-2)" }}>{c.recovery_delay}</td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/crm/${c.id}`} className="text-[11px] font-semibold hover:underline" style={{ color: "var(--color-g-600)" }}>
                        Fiche →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
