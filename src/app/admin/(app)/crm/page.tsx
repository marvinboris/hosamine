"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CRMClient } from "@/lib/db/types";

const STAGE_LABELS: Record<string, string> = {
  new: "Nouveau", diagnostic: "Diagnostic", quote: "Devis",
  negotiation: "Négociation", advance: "Avance", service: "Prestation",
  recovery: "Recouvrement", followup: "Suivi J+7", done: "Terminé",
};

const STAGE_COLORS: Record<string, string> = {
  new: "bg-gray-100 text-gray-600",
  diagnostic: "bg-blue-50 text-blue-600",
  quote: "bg-amber-50 text-amber-700",
  negotiation: "bg-orange-50 text-orange-700",
  advance: "bg-purple-50 text-purple-700",
  service: "bg-green-50 text-green-700",
  recovery: "bg-red-50 text-red-700",
  followup: "bg-cyan-50 text-cyan-700",
  done: "bg-emerald-50 text-emerald-700",
};

export default function CRMListPage() {
  const [clients, setClients] = useState<CRMClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/crm/clients")
      .then((r) => r.json())
      .then(setClients)
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter((c) =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.sector ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (c.contact_name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-3 flex-shrink-0">
        <span className="font-[var(--font-display)] text-base font-semibold" style={{ color: "var(--color-text)" }}>
          Tous les clients
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-g-100)]" style={{ color: "var(--color-text-3)" }}>
          {clients.length}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <input
            type="search"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-400)]"
            style={{ color: "var(--color-text)" }}
          />
          <Link
            href="/admin/crm/new"
            className="px-4 py-1.5 rounded-lg bg-[var(--color-g-600)] text-white text-sm font-semibold hover:bg-[var(--color-g-700)] transition-colors"
          >
            + Nouveau
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-sm text-center mt-16" style={{ color: "var(--color-text-3)" }}>Chargement...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white border-b border-[var(--color-border)]">
              <tr>
                {["Client", "Secteur", "Contact", "Devis", "Étape", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-3)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--color-g-50)] transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>{c.full_name}</p>
                    {c.location && <p className="text-[11px]" style={{ color: "var(--color-text-3)" }}>{c.location}</p>}
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--color-text-2)" }}>{c.sector ?? "—"}</td>
                  <td className="px-5 py-3">
                    <p className="text-xs" style={{ color: "var(--color-text-2)" }}>{c.contact_name ?? "—"}</p>
                    {c.contact_phone && <p className="text-[11px]" style={{ color: "var(--color-text-3)" }}>{c.contact_phone}</p>}
                  </td>
                  <td className="px-5 py-3 text-xs font-semibold" style={{ color: "var(--color-text)" }}>
                    {c.quote_amount ? `${c.quote_amount.toLocaleString("fr-FR")} XAF` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STAGE_COLORS[c.stage] ?? ""}`}>
                      {STAGE_LABELS[c.stage] ?? c.stage}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/crm/${c.id}`}
                      className="text-[11px] font-semibold hover:underline"
                      style={{ color: "var(--color-g-600)" }}
                    >
                      Fiche →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
