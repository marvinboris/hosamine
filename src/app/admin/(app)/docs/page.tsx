"use client";

import { useState } from "react";
import Link from "next/link";
import { GUIDES, CATEGORY_LABELS, type DocCategory } from "@/lib/docs";
import { DOC_ICONS } from "@/components/admin/docIcons";

const ORDER: DocCategory[] = ["prise-en-main", "crm", "facturation", "social", "contenu", "parametres"];

export default function DocsHome() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = GUIDES.filter(
    (g) => !q || g.title.toLowerCase().includes(q) || g.summary.toLowerCase().includes(q)
  );

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-4 md:px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-3 flex-wrap gap-y-2 flex-shrink-0">
        <span className="w-[10px] h-[34px] rounded-sm bg-[var(--color-brand)] flex-shrink-0" />
        <span className="font-[var(--font-display)] text-xl font-bold" style={{ color: "var(--color-text)" }}>
          Documentation
        </span>
        <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-2 px-3.5 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-g-50)] focus-within:border-[var(--color-g-500)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--color-text-3)" }} className="flex-shrink-0"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un guide..."
            className="bg-transparent outline-none text-sm w-full sm:w-56 min-w-0"
            style={{ color: "var(--color-text)" }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <p className="text-sm max-w-2xl" style={{ color: "var(--color-text-2)" }}>
            Guides d&apos;utilisation de l&apos;espace d&apos;administration Hosamine. Choisissez une fonctionnalité pour
            en découvrir le fonctionnement pas à pas.
          </p>

          {ORDER.map((cat) => {
            const guides = filtered.filter((g) => g.category === cat);
            if (guides.length === 0) return null;
            return (
              <section key={cat}>
                <h2 className="text-[11px] font-black uppercase tracking-[0.14em] mb-3" style={{ color: "var(--color-brand)" }}>
                  {CATEGORY_LABELS[cat]}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {guides.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/admin/docs/${g.slug}`}
                      className="bg-white rounded-xl border border-[var(--color-border)] p-5 hover:border-[var(--color-g-400)] transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-g-100)] text-[var(--color-g-700)] flex items-center justify-center mb-3 group-hover:bg-[var(--color-brand)] group-hover:text-white transition-colors">
                        {DOC_ICONS[g.icon] ?? DOC_ICONS.book}
                      </div>
                      <p className="font-[var(--font-display)] font-bold text-sm mb-1" style={{ color: "var(--color-text)" }}>
                        {g.title}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-3)" }}>
                        {g.summary}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-sm text-center py-16" style={{ color: "var(--color-text-3)" }}>
              Aucun guide ne correspond à « {query} ».
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
