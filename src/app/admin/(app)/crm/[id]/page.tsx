"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { CRMClient, CRMHistory, CRMDocument } from "@/lib/db/types";

const DOC_LABELS: Record<string, string> = {
  pv_traitement:       "Procès-verbal de traitement",
  bordereau_reception: "Bordereau de réception des travaux",
  attestation:         "Attestation de traitement",
};

const STAGE_LABELS: Record<string, string> = {
  new: "Nouveau", diagnostic: "Diagnostic", quote: "Devis",
  negotiation: "Négociation", advance: "Avance", service: "Prestation",
  recovery: "Recouvrement", followup: "Suivi J+7", done: "Terminé",
};

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<CRMClient | null>(null);
  const [history, setHistory] = useState<CRMHistory[]>([]);
  const [documents, setDocuments] = useState<CRMDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/crm/clients/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setClient(data.client);
        setHistory(data.history ?? []);
        setDocuments(data.documents ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function markDocSigned(docId: string) {
    const res = await fetch(`/api/crm/documents/${docId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "signed", signed_at: new Date().toISOString() }),
    });
    if (res.ok) {
      const updated = await res.json();
      setDocuments((prev) => prev.map((d) => (d.id === docId ? updated : d)));
    }
  }

  async function saveField(field: string, value: unknown) {
    if (!client) return;
    setSaving(true);
    const res = await fetch(`/api/crm/clients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    if (res.ok) {
      const updated = await res.json();
      setClient(updated);
    }
    setSaving(false);
  }

  if (loading) return <div className="flex-1 flex items-center justify-center text-sm" style={{ color: "var(--color-text-3)" }}>Chargement...</div>;
  if (!client) return <div className="flex-1 flex items-center justify-center text-sm text-red-600">Client introuvable.</div>;

  const balance = client.quote_amount ? client.quote_amount - client.advance_paid : 0;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Topbar */}
      <div className="px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-3 flex-shrink-0">
        <Link href="/admin" className="text-sm" style={{ color: "var(--color-text-3)" }}>Pipeline</Link>
        <span style={{ color: "var(--color-text-3)" }}>/</span>
        <span className="font-[var(--font-display)] text-base font-semibold truncate" style={{ color: "var(--color-text)" }}>
          {client.full_name}
        </span>
        {saving && <span className="text-xs ml-2" style={{ color: "var(--color-text-3)" }}>Sauvegarde...</span>}
        <div className="ml-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
            {STAGE_LABELS[client.stage] ?? client.stage}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Infos client */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-[var(--font-display)] text-sm font-bold mb-4" style={{ color: "var(--color-text)" }}>Informations client</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "Nom complet", field: "full_name", value: client.full_name },
                { label: "Localisation", field: "location", value: client.location ?? "—" },
                { label: "Secteur", field: "sector", value: client.sector ?? "—" },
                { label: "Contact", field: "contact_name", value: client.contact_name ?? "—" },
                { label: "Téléphone", field: "contact_phone", value: client.contact_phone ?? "—" },
                { label: "Email", field: "contact_email", value: client.contact_email ?? "—" },
              ].map(({ label, field, value }) => (
                <div key={field}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-3)" }}>{label}</p>
                  <p
                    className="text-xs cursor-pointer px-2 py-1 -mx-2 rounded hover:bg-[var(--color-g-50)] transition-colors"
                    style={{ color: "var(--color-text)" }}
                    onClick={() => {
                      const v = prompt(label, value === "—" ? "" : value);
                      if (v !== null) saveField(field, v);
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-3)" }}>Besoin / Douleur</p>
                <p
                  className="text-xs leading-relaxed cursor-pointer px-2 py-1 -mx-2 rounded hover:bg-[var(--color-g-50)] transition-colors"
                  style={{ color: "var(--color-text-2)" }}
                  onClick={() => {
                    const v = prompt("Besoin identifié", client.need_summary ?? "");
                    if (v !== null) saveField("need_summary", v);
                  }}
                >
                  {client.need_summary ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Devis */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-[var(--font-display)] text-sm font-bold mb-4" style={{ color: "var(--color-text)" }}>Devis Challenge</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Référence", field: "quote_ref", value: client.quote_ref ?? "—" },
                { label: "Délai recouvrement (jours)", field: "recovery_delay", value: String(client.recovery_delay ?? 30) },
                { label: "Montant total (XAF)", field: "quote_amount", value: client.quote_amount ? client.quote_amount.toLocaleString("fr-FR") : "—" },
                { label: "Avance versée (XAF)", field: "advance_paid", value: client.advance_paid > 0 ? client.advance_paid.toLocaleString("fr-FR") : "—" },
              ].map(({ label, field, value }) => (
                <div key={field}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-3)" }}>{label}</p>
                  <p
                    className="text-sm font-semibold cursor-pointer px-2 py-1 -mx-2 rounded hover:bg-[var(--color-g-50)] transition-colors"
                    style={{ color: "var(--color-text)" }}
                    onClick={() => {
                      const v = prompt(label, value === "—" ? "" : value.replace(/\s/g, ""));
                      if (v !== null) saveField(field, field.includes("amount") || field.includes("paid") || field === "recovery_delay" ? Number(v.replace(/\s/g, "")) : v);
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
              {balance > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-3)" }}>Solde à recouvrer</p>
                  <p className="text-sm font-bold" style={{ color: "var(--color-a-600)" }}>{balance.toLocaleString("fr-FR")} XAF</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-[var(--font-display)] text-sm font-bold mb-4" style={{ color: "var(--color-text)" }}>Documents à signer</h2>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 px-3 py-2.5 border border-[var(--color-border)] rounded-lg">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    doc.status === "signed" ? "bg-green-500" : "bg-[var(--color-border)]"
                  }`}>
                    {doc.status === "signed" && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </div>
                  <span className="text-xs flex-1" style={{ color: "var(--color-text)" }}>{DOC_LABELS[doc.type]}</span>
                  {doc.status === "signed" ? (
                    <span className="text-[10px] font-semibold text-green-600">
                      Signé {doc.signed_at ? new Date(doc.signed_at).toLocaleDateString("fr-FR") : ""}
                    </span>
                  ) : (
                    <button
                      onClick={() => markDocSigned(doc.id)}
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-md border text-green-700 border-green-300 bg-green-50 hover:bg-green-100 transition-colors"
                    >
                      Marquer signé
                    </button>
                  )}
                </div>
              ))}
              {documents.length === 0 && (
                <p className="text-xs" style={{ color: "var(--color-text-3)" }}>Aucun document lié.</p>
              )}
            </div>
          </div>

          {/* Suivi J+7 */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-[var(--font-display)] text-sm font-bold mb-4" style={{ color: "var(--color-text)" }}>Suivi J+7</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-3)" }}>Date de prestation</p>
                <input
                  type="date"
                  defaultValue={client.service_date ?? ""}
                  onBlur={(e) => saveField("service_date", e.target.value || null)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-500)]"
                  style={{ color: "var(--color-text)" }}
                />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-3)" }}>Date de rappel</p>
                <input
                  type="date"
                  defaultValue={client.next_followup ?? ""}
                  onBlur={(e) => saveField("next_followup", e.target.value || null)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-500)]"
                  style={{ color: "var(--color-text)" }}
                />
              </div>
            </div>
          </div>

          {/* Historique */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-[var(--font-display)] text-sm font-bold mb-4" style={{ color: "var(--color-text)" }}>Historique</h2>
            {history.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--color-text-3)" }}>Aucune activité enregistrée.</p>
            ) : (
              <div className="space-y-0 relative">
                {history.map((h, i) => (
                  <div key={h.id} className="flex gap-3 pb-4 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0" style={{ backgroundColor: "var(--color-g-400)" }} />
                      {i < history.length - 1 && <div className="w-px flex-1 mt-1" style={{ backgroundColor: "var(--color-border)" }} />}
                    </div>
                    <div className="flex-1 pb-1">
                      <p className="text-xs font-medium" style={{ color: "var(--color-text)" }}>{h.action}</p>
                      {h.note && <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-2)" }}>{h.note}</p>}
                      {h.amount && <p className="text-[11px] font-semibold mt-0.5" style={{ color: "var(--color-g-600)" }}>{h.amount.toLocaleString("fr-FR")} XAF</p>}
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-3)" }}>
                        {new Date(h.created_at).toLocaleString("fr-FR")}
                        {h.created_by ? ` · ${h.created_by}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
