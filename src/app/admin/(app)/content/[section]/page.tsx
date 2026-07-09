"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { ContentBlock } from "@/lib/db/types";

const SECTION_LABELS: Record<string, string> = {
  nav:          "Navigation",
  hero:         "Hero — Bannière principale",
  services:     "Services",
  stats:        "Chiffres clés",
  about:        "À propos",
  clients:      "Clients",
  testimonials: "Témoignages",
  partners:     "Partenaires",
  cta:          "Appel à l'action",
  contact:      "Contact",
  footer:       "Pied de page",
  chatbot:      "Chatbot",
};

const KEY_LABELS: Record<string, string> = {
  title:       "Titre",
  subtitle:    "Sous-titre",
  cta_primary: "Bouton principal",
  cta_secondary: "Bouton secondaire",
  description: "Description",
  tagline:     "Accroche",
  address:     "Adresse",
  phone:       "Téléphone",
  email:       "Email",
};

export default function ContentSectionPage() {
  const { section } = useParams<{ section: string }>();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [edits, setEdits] = useState<Record<string, { fr: string; en: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/content/blocks/${section}`)
      .then((r) => r.json())
      .then((data: ContentBlock[]) => {
        setBlocks(data);
        const initial: Record<string, { fr: string; en: string }> = {};
        data.forEach((b) => {
          initial[b.key] = { fr: b.fr ?? "", en: b.en ?? "" };
        });
        setEdits(initial);
      })
      .finally(() => setLoading(false));
  }, [section]);

  function update(key: string, lang: "fr" | "en", value: string) {
    setSaved(false);
    setEdits((prev) => ({ ...prev, [key]: { ...prev[key], [lang]: value } }));
  }

  async function handleSave() {
    setSaving(true);
    const updates = Object.entries(edits).map(([key, val]) => ({
      key,
      fr: val.fr,
      en: val.en,
    }));
    const res = await fetch(`/api/content/blocks/${section}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-3 flex-shrink-0">
        <Link href="/admin/content" className="text-sm" style={{ color: "var(--color-text-3)" }}>
          Contenu
        </Link>
        <span style={{ color: "var(--color-text-3)" }}>/</span>
        <span className="font-[var(--font-display)] text-base font-semibold" style={{ color: "var(--color-text)" }}>
          {SECTION_LABELS[section] ?? section}
        </span>
        <div className="ml-auto flex items-center gap-3">
          {saved && <span className="text-xs text-green-600 font-medium">Sauvegardé ✓</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60 transition-opacity"
            style={{ backgroundColor: "var(--color-g-600)" }}
          >
            {saving ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-sm text-center mt-16" style={{ color: "var(--color-text-3)" }}>Chargement...</p>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Column headers */}
            <div className="grid grid-cols-[200px_1fr_1fr] gap-4 px-1">
              <div />
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-3)" }}>
                🇫🇷 Français
              </p>
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-3)" }}>
                🇬🇧 English
              </p>
            </div>

            {blocks.map((block) => {
              const isLong = block.type === "rich_text" || (edits[block.key]?.fr?.length ?? 0) > 80;
              return (
                <div key={block.key} className="grid grid-cols-[200px_1fr_1fr] gap-4 items-start">
                  <div className="pt-2.5">
                    <p className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>
                      {KEY_LABELS[block.key] ?? block.key}
                    </p>
                    <p className="text-[10px] mt-0.5 font-mono" style={{ color: "var(--color-text-3)" }}>
                      {block.key}
                    </p>
                  </div>
                  {(["fr", "en"] as const).map((lang) => (
                    isLong ? (
                      <textarea
                        key={lang}
                        value={edits[block.key]?.[lang] ?? ""}
                        onChange={(e) => update(block.key, lang, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-500)] resize-y leading-relaxed"
                        style={{ color: "var(--color-text)" }}
                      />
                    ) : (
                      <input
                        key={lang}
                        type="text"
                        value={edits[block.key]?.[lang] ?? ""}
                        onChange={(e) => update(block.key, lang, e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-500)]"
                        style={{ color: "var(--color-text)" }}
                      />
                    )
                  ))}
                </div>
              );
            })}

            {blocks.length === 0 && (
              <p className="text-sm text-center mt-16" style={{ color: "var(--color-text-3)" }}>
                Aucun champ dans cette section.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
