"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getGuide } from "@/lib/docs";
import { DOC_ICONS } from "@/components/admin/docIcons";

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = getGuide(slug);

  if (!guide) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-3 p-6">
        <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Guide introuvable.</p>
        <Link href="/admin/docs" className="text-sm font-semibold" style={{ color: "var(--color-brand)" }}>
          ← Retour à la documentation
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-4 md:px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-3 flex-wrap gap-y-2 flex-shrink-0">
        <Link href="/admin/docs" className="text-sm" style={{ color: "var(--color-text-3)" }}>Documentation</Link>
        <span style={{ color: "var(--color-text-3)" }}>/</span>
        <span className="font-[var(--font-display)] text-xl font-bold" style={{ color: "var(--color-text)" }}>
          {guide.title}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <article className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-brand)] text-white flex items-center justify-center flex-shrink-0">
              {DOC_ICONS[guide.icon] ?? DOC_ICONS.book}
            </div>
            <div>
              <h1 className="font-[var(--font-display)] text-2xl font-black leading-tight tracking-[-0.01em]" style={{ color: "var(--color-ink)" }}>
                {guide.title}
              </h1>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--color-text-2)" }}>{guide.summary}</p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {guide.sections.map((sec, i) => (
              <section key={i}>
                <h2 className="font-[var(--font-display)] text-base font-bold mb-3" style={{ color: "var(--color-text)" }}>
                  {sec.heading}
                </h2>

                {sec.body?.map((p, j) => (
                  <p key={j} className="text-sm leading-[1.7] mb-3" style={{ color: "var(--color-text-2)" }}>{p}</p>
                ))}

                {sec.steps && (
                  <ol className="space-y-2.5 my-3">
                    {sec.steps.map((step, j) => (
                      <li key={j} className="flex gap-3 text-sm leading-[1.6]" style={{ color: "var(--color-text)" }}>
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-g-100)] text-[var(--color-g-700)] text-xs font-bold flex items-center justify-center mt-0.5">
                          {j + 1}
                        </span>
                        <span className="flex-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {sec.tips?.map((tip, j) => (
                  <div key={j} className="flex gap-2.5 mt-3 rounded-lg border border-[var(--color-a-400)] bg-[var(--color-a-100)] p-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5" style={{ color: "var(--color-a-600)" }}><path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" /></svg>
                    <p className="text-xs leading-relaxed" style={{ color: "oklch(38% 0.06 60)" }}>
                      <strong>Astuce.</strong> {tip}
                    </p>
                  </div>
                ))}
              </section>
            ))}
          </div>

          {/* Related */}
          {guide.related && guide.related.length > 0 && (
            <div className="mt-10 pt-6 border-t border-[var(--color-border)]">
              <h2 className="text-[11px] font-black uppercase tracking-[0.14em] mb-3" style={{ color: "var(--color-text-3)" }}>
                Articles liés
              </h2>
              <div className="flex flex-col gap-2">
                {guide.related.map((rel) => {
                  const g = getGuide(rel);
                  if (!g) return null;
                  return (
                    <Link
                      key={rel}
                      href={`/admin/docs/${rel}`}
                      className="flex items-center gap-3 text-sm font-semibold hover:underline"
                      style={{ color: "var(--color-brand)" }}
                    >
                      <span className="w-7 h-7 rounded-lg bg-[var(--color-g-100)] text-[var(--color-g-700)] flex items-center justify-center flex-shrink-0">
                        {DOC_ICONS[g.icon] ?? DOC_ICONS.book}
                      </span>
                      {g.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
