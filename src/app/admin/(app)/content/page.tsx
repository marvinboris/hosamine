"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ContentBlock } from "@/lib/db/types";

const SECTION_LABELS: Record<string, string> = {
  hero:       "Hero — Bannière principale",
  services:   "Services",
  about:      "À propos",
  stats:      "Chiffres clés",
  cta:        "Appel à l'action",
  contact:    "Contact",
  footer:     "Pied de page",
};

export default function ContentListPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/blocks")
      .then((r) => r.json())
      .then(setBlocks)
      .finally(() => setLoading(false));
  }, []);

  const sections = [...new Set(blocks.map((b) => b.section))];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center flex-shrink-0">
        <span className="font-[var(--font-display)] text-base font-semibold" style={{ color: "var(--color-text)" }}>
          Contenu du site
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-sm text-center mt-16" style={{ color: "var(--color-text-3)" }}>Chargement...</p>
        ) : (
          <div className="max-w-2xl mx-auto space-y-2">
            {sections.map((section) => {
              const sectionBlocks = blocks.filter((b) => b.section === section);
              const lastUpdated = sectionBlocks.reduce(
                (latest, b) => (b.updated_at > latest ? b.updated_at : latest),
                ""
              );
              return (
                <Link
                  key={section}
                  href={`/admin/content/${section}`}
                  className="flex items-center gap-4 bg-white rounded-xl border border-[var(--color-border)] p-4 hover:border-[var(--color-g-300)] transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                      {SECTION_LABELS[section] ?? section}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-3)" }}>
                      {sectionBlocks.length} champ{sectionBlocks.length > 1 ? "s" : ""} ·{" "}
                      {lastUpdated ? `Modifié ${new Date(lastUpdated).toLocaleDateString("fr-FR")}` : "Jamais modifié"}
                    </p>
                  </div>
                  <span className="text-xs font-medium" style={{ color: "var(--color-text-3)" }}>Modifier →</span>
                </Link>
              );
            })}
            {sections.length === 0 && (
              <p className="text-sm text-center mt-16" style={{ color: "var(--color-text-3)" }}>
                Aucun bloc de contenu trouvé dans la base.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
