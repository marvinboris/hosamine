"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CRMDocument } from "@/lib/db/types";

type DocRow = CRMDocument & { crm_clients: { full_name: string } | null };

const TYPE_LABELS: Record<CRMDocument["type"], string> = {
  pv_traitement:       "PV de traitement",
  bordereau_reception: "Bordereau de réception",
  attestation:         "Attestation",
};

type Filter = "all" | "pending" | "signed";

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    fetch("/api/crm/documents")
      .then((r) => r.json())
      .then((data: DocRow[]) => setDocs(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  async function markSigned(id: string) {
    const res = await fetch(`/api/crm/documents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "signed", signed_at: new Date().toISOString() }),
    });
    if (res.ok) {
      const updated: CRMDocument = await res.json();
      setDocs((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: updated.status, signed_at: updated.signed_at } : d))
      );
    }
  }

  const visible = docs.filter((d) => filter === "all" || d.status === filter);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-3 flex-shrink-0">
        <span className="w-1.5 h-6 rounded-full bg-[var(--color-brand)] flex-shrink-0" />
        <span className="font-[var(--font-display)] text-base font-semibold" style={{ color: "var(--color-text)" }}>
          Documents
        </span>
        <div className="ml-auto flex gap-1">
          {(["all", "pending", "signed"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === f
                  ? "bg-[var(--color-g-600)] text-white"
                  : "bg-[var(--color-g-100)] text-[var(--color-text-2)] hover:bg-[var(--color-g-200)]"
              }`}
            >
              {f === "all" ? "Tous" : f === "pending" ? "En attente" : "Signés"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-sm text-center mt-16" style={{ color: "var(--color-text-3)" }}>Chargement...</p>
        ) : visible.length === 0 ? (
          <div className="text-center mt-16">
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>Aucun document</p>
            <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
              Les documents sont créés automatiquement à l&apos;ajout d&apos;un client.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-3">
            {visible.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-[var(--color-border)] p-4 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                    {TYPE_LABELS[doc.type]}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-3)" }}>
                    {doc.crm_clients ? (
                      <Link href={`/admin/crm/${doc.client_id}`} className="hover:underline">
                        {doc.crm_clients.full_name}
                      </Link>
                    ) : (
                      "Client inconnu"
                    )}
                    {doc.signed_at ? ` · Signé le ${new Date(doc.signed_at).toLocaleDateString("fr-FR")}` : ""}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                    doc.status === "signed" ? "bg-[var(--color-g-100)] text-[var(--color-g-700)]" : "bg-[var(--color-a-100)] text-[var(--color-a-600)]"
                  }`}
                >
                  {doc.status === "signed" ? "Signé" : "En attente"}
                </span>
                {doc.status !== "signed" && (
                  <button
                    onClick={() => markSigned(doc.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-g-600)] text-white hover:bg-[var(--color-g-700)] transition-colors flex-shrink-0"
                  >
                    Marquer signé
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
