"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CRMClient, Stage } from "@/lib/db/types";

const STAGES: { key: Stage; label: string; color: string }[] = [
  { key: "new",         label: "Nouveau client",      color: "bg-[var(--color-g-400)]" },
  { key: "diagnostic",  label: "Diagnostic planifié", color: "bg-[var(--color-g-500)]" },
  { key: "quote",       label: "Devis envoyé",        color: "bg-[var(--color-a-500)]" },
  { key: "advance",     label: "Avance reçue",        color: "bg-[var(--color-g-600)]" },
  { key: "service",     label: "Prestation",          color: "bg-[var(--color-brand)]" },
  { key: "recovery",    label: "Recouvrement",        color: "bg-red-500" },
  { key: "followup",    label: "Suivi J+7",           color: "bg-[var(--color-g-700)]" },
];

const NEXT_STAGE: Partial<Record<Stage, Stage>> = {
  new: "diagnostic",
  diagnostic: "quote",
  quote: "advance",
  advance: "service",
  service: "recovery",
  recovery: "followup",
  followup: "done",
};

function serviceBadge(s: string) {
  // Formations = amber accent; everything else = brand green tint.
  return s === "Formation"
    ? "bg-[var(--color-a-100)] text-[var(--color-a-600)]"
    : "bg-[var(--color-g-100)] text-[var(--color-g-700)]";
}

function inferService(client: CRMClient) {
  const t = (client.need_summary ?? "").toLowerCase();
  if (t.includes("fumig")) return "Fumigation";
  if (t.includes("désinsect")) return "Désinsectisation";
  if (t.includes("dératisa")) return "Dératisation";
  if (t.includes("désinfect")) return "Désinfection";
  if (t.includes("formation")) return "Formation";
  if (t.includes("hygiène") || t.includes("hygiene")) return "Hygiène";
  return "Phytosanitaire";
}

export default function CRMPipeline() {
  const [clients, setClients] = useState<CRMClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [advancing, setAdvancing] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "all">("all");

  const selected = clients.find((c) => c.id === selectedId) ?? null;

  const q = query.trim().toLowerCase();
  const matches = (c: CRMClient) =>
    !q ||
    c.full_name.toLowerCase().includes(q) ||
    (c.sector ?? "").toLowerCase().includes(q) ||
    (c.location ?? "").toLowerCase().includes(q) ||
    (c.contact_name ?? "").toLowerCase().includes(q);

  useEffect(() => {
    fetch("/api/crm/clients")
      .then((r) => r.json())
      .then((data) => {
        setClients(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          const nhpc = data.find((c: CRMClient) => c.stage === "advance");
          setSelectedId(nhpc?.id ?? data[0].id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function advanceStage(client: CRMClient) {
    const nextStage = NEXT_STAGE[client.stage];
    if (!nextStage || nextStage === "done") return;
    setAdvancing(client.id);
    const res = await fetch(`/api/crm/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: nextStage, _prev_stage: client.stage }),
    });
    if (res.ok) {
      const updated = await res.json();
      setClients((prev) => prev.map((c) => (c.id === client.id ? updated : c)));
    }
    setAdvancing(null);
  }

  const activeCount = clients.filter((c) => c.stage !== "done").length;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Topbar */}
      <div className="px-4 md:px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-3 flex-wrap gap-y-2 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-[10px] h-[34px] rounded-sm bg-[var(--color-brand)] flex-shrink-0" />
          <span className="font-[var(--font-display)] text-xl font-bold text-[var(--color-text)]">
            Pipeline Commercial
          </span>
          {!loading && (
            <span className="text-sm ml-2" style={{ color: "var(--color-text-3)" }}>
              — {activeCount} dossiers actifs
            </span>
          )}
        </div>
        <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-2.5 flex-wrap gap-y-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-g-50)] text-sm focus-within:border-[var(--color-g-500)] flex-1 sm:flex-none min-w-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--color-text-3)" }} className="flex-shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un client..."
              className="bg-transparent outline-none w-full sm:w-40 text-sm min-w-0"
              style={{ color: "var(--color-text)" }}
            />
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as Stage | "all")}
            className="px-3.5 py-1.5 border border-[var(--color-border)] rounded-lg text-sm font-semibold bg-white outline-none focus:border-[var(--color-g-500)]"
            style={{ color: "var(--color-text-2)" }}
          >
            <option value="all">Toutes les étapes</option>
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <Link
            href="/admin/crm/new"
            className="px-3.5 py-1.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--color-g-600)" }}
          >
            + Nouveau client
          </Link>
        </div>
      </div>

      {/* Kanban + Detail */}
      <div className="flex flex-1 overflow-hidden">
        {/* Kanban */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden flex">
          {loading ? (
            <div className="flex-1 flex items-center justify-center" style={{ color: "var(--color-text-3)" }}>
              Chargement...
            </div>
          ) : (
            <div className="flex h-full">
              {STAGES.filter((stage) => stageFilter === "all" || stage.key === stageFilter).map((stage) => {
                const cards = clients.filter((c) => c.stage === stage.key && matches(c));
                return (
                  <div
                    key={stage.key}
                    className="w-[220px] flex-shrink-0 flex flex-col border-r border-[var(--color-border)] bg-[var(--color-g-50)]"
                  >
                    <div className="px-3.5 py-3 bg-white border-b border-[var(--color-border)] flex-shrink-0">
                      <div className="flex items-center gap-2 font-[var(--font-display)] text-xs font-bold mb-1" style={{ color: "var(--color-text)" }}>
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${stage.color}`} />
                        {stage.label}
                      </div>
                      <p className="text-[11px]" style={{ color: "var(--color-text-3)" }}>{cards.length} dossier{cards.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
                      {cards.map((client) => {
                        const svc = inferService(client);
                        const isSelected = selectedId === client.id;
                        return (
                          <button
                            key={client.id}
                            onClick={() => setSelectedId(client.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-all bg-white ${
                              isSelected
                                ? "border-[var(--color-g-600)] shadow-[0_0_0_2px_oklch(40%_0.13_145/0.12)]"
                                : "border-[var(--color-border)] hover:border-[var(--color-g-400)] shadow-[0_1px_3px_oklch(20%_0.10_145/0.06)]"
                            }`}
                          >
                            <p className="font-[var(--font-display)] text-[11px] font-semibold truncate mb-1" style={{ color: "var(--color-text)" }}>
                              {client.full_name}
                            </p>
                            <p className="text-[10px] truncate mb-2" style={{ color: "var(--color-text-3)" }}>
                              {client.sector} · {client.location}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${serviceBadge(svc)}`}>{svc}</span>
                              {client.next_followup && new Date(client.next_followup) <= new Date() && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-600">Suivi requis</span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px]" style={{ color: "var(--color-text-3)" }}>
                                {new Date(client.created_at).toLocaleDateString("fr-FR")}
                              </span>
                              {client.quote_amount && (
                                <span className="text-[10px] font-semibold truncate max-w-[80px]" style={{ color: "var(--color-g-600)" }}>
                                  {client.quote_amount.toLocaleString("fr-FR")} XAF
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                      {cards.length === 0 && (
                        <p className="text-center text-[11px] py-4 leading-relaxed" style={{ color: "var(--color-text-3)" }}>
                          Aucun dossier
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail panel — side column on desktop, full-screen drawer on mobile */}
        {selected && (
          <div className="fixed inset-0 z-40 w-full bg-white flex flex-col overflow-y-auto lg:static lg:z-auto lg:w-[340px] lg:flex-shrink-0 lg:border-l lg:border-[var(--color-border)]">
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-start gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-g-100)] flex items-center justify-center font-[var(--font-display)] font-bold text-[var(--color-g-600)] flex-shrink-0">
                {selected.full_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-[var(--font-display)] text-sm font-bold truncate" style={{ color: "var(--color-text)" }}>{selected.full_name}</p>
                <p className="text-xs" style={{ color: "var(--color-text-3)" }}>{selected.sector} · {selected.location}</p>
              </div>
              <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                {STAGES.find((s) => s.key === selected.stage)?.label}
              </span>
              <button
                onClick={() => setSelectedId(null)}
                aria-label="Fermer"
                className="lg:hidden flex-shrink-0 text-[var(--color-text-3)] hover:text-[var(--color-text)]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="p-5 space-y-5 flex-1">
              {/* Contact */}
              {selected.contact_name && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: "var(--color-text-3)" }}>Contact</p>
                  <p className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>{selected.contact_name}</p>
                  {selected.contact_phone && <p className="text-xs" style={{ color: "var(--color-text-2)" }}>{selected.contact_phone}</p>}
                </div>
              )}

              {/* Besoin */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: "var(--color-text-3)" }}>Besoin identifié</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-2)" }}>{selected.need_summary ?? "—"}</p>
              </div>

              {/* Devis */}
              {selected.quote_amount && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: "var(--color-text-3)" }}>Devis Challenge</p>
                  <div className="bg-[var(--color-g-50)] border border-[var(--color-border)] rounded-lg p-3 space-y-1.5">
                    {selected.quote_ref && (
                      <div className="flex justify-between text-xs">
                        <span style={{ color: "var(--color-text-2)" }}>Référence</span>
                        <span className="font-[var(--font-display)] font-semibold" style={{ color: "var(--color-text)" }}>{selected.quote_ref}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "var(--color-text-2)" }}>Montant total</span>
                      <span className="font-[var(--font-display)] font-bold" style={{ color: "var(--color-text)" }}>
                        {selected.quote_amount.toLocaleString("fr-FR")} XAF
                      </span>
                    </div>
                    {selected.advance_paid > 0 && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span style={{ color: "var(--color-text-2)" }}>Avance versée</span>
                          <span className="font-semibold" style={{ color: "var(--color-g-600)" }}>
                            {selected.advance_paid.toLocaleString("fr-FR")} XAF
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span style={{ color: "var(--color-text-2)" }}>Solde à recouvrer</span>
                          <span className="font-bold" style={{ color: "var(--color-a-600)" }}>
                            {(selected.quote_amount - selected.advance_paid).toLocaleString("fr-FR")} XAF
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Suivi J+7 */}
              {selected.next_followup && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5">
                  <p className="font-[var(--font-display)] text-xs font-bold text-amber-800 mb-1">Rappel suivi J+7</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Appel prévu le <strong>{new Date(selected.next_followup).toLocaleDateString("fr-FR")}</strong>
                    {selected.service_date && ` après prestation du ${new Date(selected.service_date).toLocaleDateString("fr-FR")}`}.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-[var(--color-border)] flex flex-wrap gap-2 flex-shrink-0">
              {selected.contact_phone && (
                <a
                  href={`tel:${selected.contact_phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.69 18.9 19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.59 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.89a16 16 0 0 0 6 6"/></svg>
                  Appeler
                </a>
              )}
              {selected.contact_phone && (
                <a
                  href={`https://wa.me/${selected.contact_phone.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  WhatsApp
                </a>
              )}
              <Link
                href={`/admin/crm/${selected.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-g-100)] text-[var(--color-g-700)] hover:bg-[var(--color-g-200)] transition-colors"
              >
                Fiche complète
              </Link>
              {NEXT_STAGE[selected.stage] && NEXT_STAGE[selected.stage] !== "done" && (
                <button
                  onClick={() => advanceStage(selected)}
                  disabled={advancing === selected.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors ml-auto disabled:opacity-60"
                  style={{ backgroundColor: "var(--color-g-600)" }}
                >
                  {advancing === selected.id ? "..." : `→ ${STAGES.find((s) => s.key === NEXT_STAGE[selected.stage])?.label}`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
