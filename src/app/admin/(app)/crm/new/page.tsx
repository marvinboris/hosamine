"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SECTORS = [
  "Pétrole & Gaz", "Banque", "Santé", "Logistique", "Agro-industrie",
  "Industrie", "Maritime", "Énergie / ONG", "Textile", "Commerce", "Autre",
];

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const body = {
      full_name:     fd.get("full_name"),
      location:      fd.get("location"),
      sector:        fd.get("sector"),
      contact_name:  fd.get("contact_name"),
      contact_phone: fd.get("contact_phone"),
      contact_email: fd.get("contact_email"),
      need_summary:  fd.get("need_summary"),
    };

    const res = await fetch("/api/crm/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/crm/${data.id}`);
    } else {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de la création.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Topbar */}
      <div className="px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-3 flex-shrink-0">
        <Link href="/admin" className="text-sm" style={{ color: "var(--color-text-3)" }}>
          Pipeline
        </Link>
        <span style={{ color: "var(--color-text-3)" }}>/</span>
        <span className="font-[var(--font-display)] text-base font-semibold" style={{ color: "var(--color-text)" }}>
          Nouveau client
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1 */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <h2 className="font-[var(--font-display)] text-sm font-bold mb-5" style={{ color: "var(--color-text)" }}>
                Informations client
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-3)" }}>
                    Nom complet *
                  </label>
                  <input
                    name="full_name"
                    required
                    placeholder="Ex: NHPC — Nachtigal"
                    className="w-full px-3.5 py-2.5 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-500)] transition-colors"
                    style={{ color: "var(--color-text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-3)" }}>
                    Localisation
                  </label>
                  <input
                    name="location"
                    placeholder="Ex: Douala, Bassa"
                    className="w-full px-3.5 py-2.5 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-500)] transition-colors"
                    style={{ color: "var(--color-text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-3)" }}>
                    Secteur d&apos;activité
                  </label>
                  <select
                    name="sector"
                    className="w-full px-3.5 py-2.5 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-500)] transition-colors bg-white"
                    style={{ color: "var(--color-text)" }}
                  >
                    <option value="">Choisir...</option>
                    {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <h2 className="font-[var(--font-display)] text-sm font-bold mb-5" style={{ color: "var(--color-text)" }}>
                Contact principal
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-3)" }}>
                    Nom du contact
                  </label>
                  <input
                    name="contact_name"
                    placeholder="Ex: Alain Mbock"
                    className="w-full px-3.5 py-2.5 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-500)] transition-colors"
                    style={{ color: "var(--color-text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-3)" }}>
                    Téléphone
                  </label>
                  <input
                    name="contact_phone"
                    type="tel"
                    placeholder="+237 6xx xxx xxx"
                    className="w-full px-3.5 py-2.5 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-500)] transition-colors"
                    style={{ color: "var(--color-text)" }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-3)" }}>
                    Email
                  </label>
                  <input
                    name="contact_email"
                    type="email"
                    placeholder="contact@entreprise.com"
                    className="w-full px-3.5 py-2.5 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-500)] transition-colors"
                    style={{ color: "var(--color-text)" }}
                  />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <h2 className="font-[var(--font-display)] text-sm font-bold mb-5" style={{ color: "var(--color-text)" }}>
                Besoin / Douleur identifiée
              </h2>
              <textarea
                name="need_summary"
                rows={4}
                placeholder="Décrivez le besoin ou la problématique identifiée lors du premier contact..."
                className="w-full px-3.5 py-2.5 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-500)] transition-colors resize-none leading-relaxed"
                style={{ color: "var(--color-text)" }}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-3 justify-end">
              <Link
                href="/admin"
                className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg text-sm font-semibold hover:bg-[var(--color-g-50)] transition-colors"
                style={{ color: "var(--color-text-2)" }}
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold font-[var(--font-display)] disabled:opacity-60 transition-opacity"
                style={{ backgroundColor: "var(--color-g-600)" }}
              >
                {loading ? "Création..." : "Créer le client →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
