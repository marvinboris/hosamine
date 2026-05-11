"use client";

import { useState } from "react";
import Link from "next/link";

type Stage = "new" | "diagnostic" | "quote" | "advance" | "service" | "recovery" | "followup";

interface Client {
  id: string;
  name: string;
  sector: string;
  service: string;
  stage: Stage;
  date: string;
  amount?: string;
  urgent?: boolean;
  overdue?: boolean;
}

const STAGES: { key: Stage; label: string; color: string }[] = [
  { key: "new",        label: "Nouveau client",      color: "bg-blue-500" },
  { key: "diagnostic", label: "Diagnostic planifié",  color: "bg-[var(--color-g-500)]" },
  { key: "quote",      label: "Devis envoyé",         color: "bg-[var(--color-a-500)]" },
  { key: "advance",    label: "Avance reçue",         color: "bg-[var(--color-g-600)]" },
  { key: "service",    label: "Prestation",           color: "bg-purple-500" },
  { key: "recovery",   label: "Recouvrement",         color: "bg-red-500" },
  { key: "followup",   label: "Suivi J+7",            color: "bg-[var(--color-g-400)]" },
];

const DEMO_CLIENTS: Client[] = [
  { id: "1", name: "Brasseries du Cameroun", sector: "Agro-industrie · Douala",  service: "Hygiène",        stage: "new",        date: "Aujourd'hui" },
  { id: "2", name: "Etabl. Kotto & Fils",    sector: "Logistique · Douala",      service: "Phytosanitaire", stage: "new",        date: "Hier" },
  { id: "3", name: "CICAM Douala",           sector: "Industrie · Douala",       service: "Dératisation",   stage: "diagnostic", date: "12 mai",  amount: "RDV 14h00" },
  { id: "4", name: "Clinique Bonanjo",       sector: "Santé · Douala",           service: "Désinfection",   stage: "diagnostic", date: "14 mai" },
  { id: "5", name: "Port Autonome de Douala",sector: "Maritime · Douala",        service: "Fumigation",     stage: "quote",      date: "8 mai",   amount: "2 450 000 XAF", urgent: true },
  { id: "6", name: "Sté Générale Cameroun",  sector: "Banque · Douala",          service: "Désinsectisation",stage: "quote",     date: "9 mai",   amount: "780 000 XAF" },
  { id: "7", name: "Maersk Cameroun",        sector: "Logistique · Douala",      service: "Fumigation",     stage: "quote",      date: "10 mai",  amount: "1 200 000 XAF" },
  { id: "8", name: "NHPC — Nachtigal",       sector: "Énergie / ONG · Nachtigal",service: "Formation",      stage: "advance",    date: "5 mai",   amount: "3 200 000 XAF" },
  { id: "9", name: "NOVIA Industries",       sector: "Industrie · Douala",       service: "Hygiène",        stage: "advance",    date: "7 mai",   amount: "950 000 XAF" },
  { id:"10", name: "Schlumberger Cameroun",  sector: "Pétrole & Gaz · Douala",   service: "Phytosanitaire", stage: "service",    date: "Aujourd'hui", amount: "4 800 000 XAF" },
  { id:"11", name: "UBA Cameroun",           sector: "Banque · Douala",          service: "Désinfection",   stage: "recovery",   date: "30 avr.",  amount: "620 000 XAF", overdue: true },
  { id:"12", name: "SAICAM",                 sector: "Agro-industrie · Douala",  service: "Hygiène",        stage: "recovery",   date: "2 mai",    amount: "1 150 000 XAF" },
];

const SERVICE_COLORS: Record<string, string> = {
  "Hygiène":         "bg-[var(--color-g-100)] text-[var(--color-g-600)]",
  "Phytosanitaire":  "bg-[var(--color-g-100)] text-[var(--color-g-600)]",
  "Fumigation":      "bg-[var(--color-g-100)] text-[var(--color-g-600)]",
  "Désinfection":    "bg-blue-50 text-blue-600",
  "Dératisation":    "bg-[var(--color-g-100)] text-[var(--color-g-600)]",
  "Désinsectisation":"bg-blue-50 text-blue-600",
  "Formation":       "bg-[var(--color-a-100)] text-[var(--color-a-600)]",
};

export default function CRMPipeline() {
  const [selectedId, setSelectedId] = useState<string>("8");
  const selected = DEMO_CLIENTS.find((c) => c.id === selectedId);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Topbar */}
      <div className="px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-4 flex-shrink-0">
        <div>
          <span className="font-[var(--font-display)] text-base font-semibold text-[var(--color-text)]">
            Pipeline Commercial
          </span>
          <span className="text-sm text-[var(--color-text-3)] ml-2">— 12 dossiers actifs</span>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-g-50)] text-sm text-[var(--color-text-3)]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>Rechercher un client...</span>
          </div>
          <button className="px-3.5 py-1.5 border border-[var(--color-border)] rounded-lg text-sm font-semibold text-[var(--color-text-2)] hover:border-[var(--color-g-400)] transition-colors">
            Filtrer
          </button>
          <Link
            href="/admin/crm/new"
            className="px-3.5 py-1.5 rounded-lg bg-[var(--color-g-600)] text-white text-sm font-semibold hover:bg-[var(--color-g-700)] transition-colors"
          >
            + Nouveau client
          </Link>
        </div>
      </div>

      {/* Kanban + Detail */}
      <div className="flex flex-1 overflow-hidden">
        {/* Kanban board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden flex">
          <div className="flex h-full">
            {STAGES.map((stage) => {
              const cards = DEMO_CLIENTS.filter((c) => c.stage === stage.key);
              return (
                <div
                  key={stage.key}
                  className="w-[220px] flex-shrink-0 flex flex-col border-r border-[var(--color-border)] bg-[var(--color-g-50)]"
                >
                  <div className="px-3.5 py-3 bg-white border-b border-[var(--color-border)] flex-shrink-0">
                    <div className="flex items-center gap-2 font-[var(--font-display)] text-xs font-bold text-[var(--color-text)] mb-1">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${stage.color}`} />
                      {stage.label}
                    </div>
                    <p className="text-[11px] text-[var(--color-text-3)]">{cards.length} dossier{cards.length !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
                    {cards.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => setSelectedId(client.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedId === client.id
                            ? "border-[var(--color-g-600)] bg-white shadow-[0_0_0_2px_oklch(40%_0.13_145/0.12)]"
                            : "border-[var(--color-border)] bg-white hover:border-[var(--color-g-400)] shadow-[0_1px_3px_oklch(20%_0.10_145/0.06)]"
                        }`}
                      >
                        <p className="font-[var(--font-display)] text-[11px] font-semibold text-[var(--color-text)] mb-1 truncate">
                          {client.name}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-3)] mb-2 truncate">{client.sector}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${SERVICE_COLORS[client.service] ?? "bg-gray-100 text-gray-600"}`}>
                            {client.service}
                          </span>
                          {client.urgent && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-a-100)] text-[var(--color-a-600)]">
                              Prioritaire
                            </span>
                          )}
                          {client.overdue && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-600">
                              En retard
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[var(--color-text-3)]">{client.date}</span>
                          {client.amount && (
                            <span className="text-[10px] font-semibold text-[var(--color-g-600)] truncate max-w-[80px]">
                              {client.amount}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                    {cards.length === 0 && (
                      <p className="text-center text-[11px] text-[var(--color-text-3)] py-4 leading-relaxed">
                        Aucun dossier
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-[340px] flex-shrink-0 bg-white border-l border-[var(--color-border)] flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-g-100)] flex items-center justify-center font-[var(--font-display)] font-bold text-[var(--color-g-600)] flex-shrink-0">
                {selected.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-[var(--font-display)] text-sm font-bold text-[var(--color-text)] truncate">{selected.name}</p>
                <p className="text-xs text-[var(--color-text-3)]">{selected.sector}</p>
              </div>
              <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[var(--color-a-100)] text-[var(--color-a-600)]">
                {STAGES.find(s => s.key === selected.stage)?.label}
              </span>
            </div>

            {/* Body */}
            <div className="p-5 space-y-6">
              {/* Devis */}
              {selected.amount && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-3)] mb-3">Devis Challenge</p>
                  <div className="bg-[var(--color-g-50)] border border-[var(--color-border)] rounded-lg p-3.5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-[var(--font-display)] text-xs font-semibold">DEV-2025-041</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-a-100)] text-[var(--color-a-600)]">Avance versée</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--color-text-2)]">Montant total</span>
                      <span className="font-[var(--font-display)] font-bold">{selected.amount}</span>
                    </div>
                    {selected.stage === "advance" && (
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--color-text-2)]">Solde à recouvrer</span>
                        <span className="font-[var(--font-display)] font-bold text-[var(--color-a-600)]">1 920 000 XAF</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Documents */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-3)] mb-3">Documents à signer</p>
                <div className="space-y-2">
                  {[
                    { label: "Procès-verbal de traitement", done: true },
                    { label: "Bordereau de réception des travaux", done: false },
                    { label: "Attestation de traitement", done: false, pending: true },
                  ].map(({ label, done, pending }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 px-3 py-2.5 border border-[var(--color-border)] rounded-lg"
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                        done ? "bg-[var(--color-g-600)]" : pending ? "border-2 border-[var(--color-a-500)] bg-[var(--color-a-100)]" : "bg-[var(--color-border)]"
                      }`}>
                        {done && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <span className="text-xs flex-1">{label}</span>
                      <span className={`text-[10px] font-semibold ${done ? "text-[var(--color-g-500)]" : pending ? "text-[var(--color-a-600)]" : "text-[var(--color-text-3)]"}`}>
                        {done ? "Signé" : pending ? "Non démarré" : "En attente"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suivi J+7 */}
              <div className="bg-[var(--color-a-100)] border border-[oklch(80%_0.10_60)] rounded-lg p-3.5">
                <p className="font-[var(--font-display)] text-xs font-bold text-[oklch(35%_0.10_60)] mb-1.5">Rappel suivi J+7</p>
                <p className="text-xs text-[oklch(40%_0.08_60)] leading-relaxed mb-3">
                  Appel de suivi prévu le <strong>18 mai 2025</strong> après la prestation du 11 mai.
                </p>
                <button className="px-3 py-1.5 rounded-md bg-[var(--color-a-600)] text-white text-xs font-semibold">
                  Planifier le rappel
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-[var(--color-border)] flex flex-wrap gap-2 flex-shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-g-100)] text-[var(--color-g-700)] text-xs font-semibold hover:bg-[var(--color-g-200)] transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.89a16 16 0 0 0 6 6"/></svg>
                Appeler
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                WhatsApp
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Documents
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-g-600)] text-white text-xs font-semibold hover:bg-[var(--color-g-700)] transition-colors ml-auto">
                Faire avancer →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
