"use client";

import { useEffect, useState } from "react";
import type { SocialPost } from "@/lib/db/types";

type Platform = "facebook" | "linkedin" | "tiktok" | "whatsapp";

interface Post {
  day: number;
  platforms: Platform[];
  title: string;
  status: "scheduled" | "draft" | "published";
}

const PLATFORM_COLORS: Record<Platform, { dot: string; tag: string; text: string }> = {
  facebook:  { dot: "bg-blue-600",    tag: "bg-blue-50 text-blue-600",    text: "Facebook" },
  linkedin:  { dot: "bg-blue-800",    tag: "bg-indigo-50 text-indigo-700", text: "LinkedIn" },
  tiktok:    { dot: "bg-red-500",     tag: "bg-red-50 text-red-600",      text: "TikTok" },
  whatsapp:  { dot: "bg-green-600",   tag: "bg-green-50 text-green-700",  text: "WhatsApp" },
};

const MAY_POSTS_DEMO: Post[] = [
  { day: 1,  platforms: ["facebook", "linkedin"], title: "Désinsectisation entreprise",      status: "published" },
  { day: 2,  platforms: ["whatsapp"],              title: "Message fête du travail",           status: "published" },
  { day: 5,  platforms: ["facebook"],              title: "Témoignage NOVIA Industries",       status: "published" },
  { day: 6,  platforms: ["tiktok"],                title: "Vidéo dératisation bureau",         status: "published" },
  { day: 8,  platforms: ["linkedin", "facebook"],  title: "Partenariat Port de Douala",        status: "scheduled" },
  { day: 11, platforms: ["facebook","linkedin","tiktok"], title: "Avant/Après intervention",   status: "scheduled" },
  { day: 12, platforms: ["facebook"],              title: "Formation NHPC — Nachtigal",        status: "scheduled" },
  { day: 14, platforms: ["tiktok"],                title: "Fumigation sous bâche (vidéo)",     status: "draft" },
  { day: 15, platforms: ["linkedin", "whatsapp"],  title: "Conseils hygiène + Offre -15%",     status: "scheduled" },
  { day: 19, platforms: ["facebook"],              title: "Coulisses équipe Hosamine",         status: "draft" },
  { day: 21, platforms: ["tiktok"],                title: "Réponse questions fréquentes",      status: "scheduled" },
  { day: 22, platforms: ["linkedin"],              title: "Dossier phytosanitaire export",     status: "draft" },
  { day: 26, platforms: ["facebook", "linkedin"],  title: "Bilan mensuel — Hosamine",          status: "scheduled" },
  { day: 28, platforms: ["whatsapp"],              title: "Newsletter WhatsApp — Mai",         status: "scheduled" },
  { day: 31, platforms: ["tiktok"],                title: "Teaser juin — nouveau service",     status: "draft" },
];

const STATUS_COLORS = {
  scheduled: "bg-[var(--color-g-100)] text-[var(--color-g-600)]",
  draft:      "bg-[var(--color-a-100)] text-[var(--color-a-600)]",
  published:  "bg-emerald-50 text-emerald-700",
};

// May 2025 starts on Thursday (day 4, 0=Mon)
const MAY_START_DOW = 3; // Thursday
const MAY_DAYS = 31;

export default function SocialCalendar() {
  const [composerOpen, setComposerOpen] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["facebook", "linkedin"]);
  const [dbPosts, setDbPosts] = useState<Post[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/social/posts?month=2025-05")
      .then((r) => r.json())
      .then((data: SocialPost[]) => {
        if (!Array.isArray(data)) return;
        const mapped: Post[] = data
          .filter((p) => p.scheduled_at)
          .map((p) => ({
            day: new Date(p.scheduled_at!).getDate(),
            platforms: p.platforms as Platform[],
            title: (p.content_fr ?? p.content_en ?? "Publication").slice(0, 50),
            status: p.status as Post["status"],
          }));
        setDbPosts(mapped);
      })
      .catch(() => setDbPosts([]));
  }, []);

  const posts = dbPosts.length > 0 ? dbPosts : MAY_POSTS_DEMO;

  function togglePlatform(p: Platform) {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  const cells: (number | null)[] = [
    ...Array(MAY_START_DOW).fill(null),
    ...Array.from({ length: MAY_DAYS }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const today = 11; // demo

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Topbar */}
      <div className="px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-3)] hover:border-[var(--color-g-400)] transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span className="font-[var(--font-display)] text-sm font-semibold text-[var(--color-text)] min-w-[130px] text-center">
            Mai 2025
          </span>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-3)] hover:border-[var(--color-g-400)] transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="px-3.5 py-1.5 border border-[var(--color-border)] rounded-lg text-sm font-semibold text-[var(--color-text-2)]">
            Vue semaine
          </button>
          <button
            onClick={() => setComposerOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[var(--color-g-600)] text-white text-sm font-semibold hover:bg-[var(--color-g-700)] transition-colors"
          >
            + Nouvelle publication
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Calendar */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Legend */}
          <div className="flex items-center gap-5 mb-5 flex-wrap">
            {(Object.entries(PLATFORM_COLORS) as [Platform, typeof PLATFORM_COLORS[Platform]][]).map(([p, c]) => (
              <span key={p} className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-2)]">
                <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />{c.text}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-xl overflow-hidden">
            {["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].map((d) => (
              <div key={d} className="bg-white px-3 py-2.5 text-[10px] font-bold tracking-wider uppercase text-[var(--color-text-3)]">
                {d}
              </div>
            ))}
            {cells.map((day, i) => {
              if (!day) {
                return <div key={`empty-${i}`} className="bg-[oklch(99%_0.004_145)] min-h-[88px]" />;
              }
              const dayPosts = posts.filter((p) => p.day === day);
              const isToday = day === today;
              return (
                <div
                  key={day}
                  className={`relative min-h-[88px] p-2.5 cursor-pointer transition-colors group ${
                    isToday ? "bg-[var(--color-g-50)]" : "bg-white hover:bg-[oklch(99%_0.006_145)]"
                  }`}
                >
                  <span className={`block text-xs font-semibold mb-1.5 ${isToday ? "text-[var(--color-g-600)] font-bold" : "text-[var(--color-text-2)]"}`}>
                    {day}
                  </span>
                  <div className="space-y-0.5">
                    {dayPosts.slice(0, 2).map((post, j) => {
                      const multi = post.platforms.length > 1;
                      const firstPlat = post.platforms[0];
                      return (
                        <div
                          key={j}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium truncate ${
                            multi
                              ? "bg-[var(--color-g-100)] text-[var(--color-g-600)]"
                              : `${PLATFORM_COLORS[firstPlat].tag}`
                          }`}
                        >
                          {post.title}
                        </div>
                      );
                    })}
                    {dayPosts.length > 2 && (
                      <div className="text-[10px] text-[var(--color-text-3)] pl-1">+{dayPosts.length - 2} de plus</div>
                    )}
                  </div>
                  <button className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded flex items-center justify-center text-[var(--color-border)] opacity-0 group-hover:opacity-100 hover:!bg-[var(--color-g-100)] hover:!text-[var(--color-g-600)] transition-all text-base leading-none">
                    +
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Composer */}
        {composerOpen && (
          <div className="w-[340px] flex-shrink-0 bg-white border-l border-[var(--color-border)] flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border)] flex-shrink-0">
              <button className="flex-1 py-3 text-xs font-semibold text-[var(--color-g-600)] border-b-2 border-[var(--color-g-600)]">
                Composer
              </button>
              <button className="flex-1 py-3 text-xs font-semibold text-[var(--color-text-3)] flex items-center justify-center gap-1">
                Brouillons
                <span className="bg-[var(--color-a-100)] text-[var(--color-a-600)] rounded-full px-1.5 py-0.5 text-[9px] font-bold">2</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Platforms */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-3)] mb-2.5">Plateformes</p>
                <div className="space-y-1.5">
                  {(Object.entries(PLATFORM_COLORS) as [Platform, typeof PLATFORM_COLORS[Platform]][]).map(([p, c]) => {
                    const selected = selectedPlatforms.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() => togglePlatform(p)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all ${
                          selected ? `border-2 ${c.tag}` : "border border-[var(--color-border)] hover:border-[var(--color-g-200)]"
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${c.dot}`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="8"/></svg>
                        </span>
                        <span className="text-xs font-semibold text-[var(--color-text)] flex-1 text-left">{c.text}</span>
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          selected ? "bg-[var(--color-g-600)] border-[var(--color-g-600)]" : "border-[var(--color-border)]"
                        }`}>
                          {selected && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-3)] mb-2.5">Contenu</p>
                <textarea
                  className="w-full px-3.5 py-3 border border-[var(--color-border)] rounded-lg text-xs leading-relaxed resize-none outline-none focus:border-[var(--color-g-400)] transition-colors"
                  rows={7}
                  defaultValue={`✅ Hosamine SARL vient de réaliser une intervention de désinsectisation complète à Douala.

🐛 Cafards, mouches, fourmis — éliminés en moins de 3h avec nos produits agréés MINSANTE.

📞 +237 677 550 011
🌐 hosamine.net

#Hosamine #Hygiène #Douala`}
                />
                <p className="text-[10px] text-[var(--color-text-3)] text-right mt-1">328 / 500</p>
              </div>

              {/* Media */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-3)] mb-2.5">Médias</p>
                <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-5 text-center cursor-pointer hover:border-[var(--color-g-400)] hover:bg-[var(--color-g-50)] transition-all">
                  <svg className="mx-auto mb-2 text-[var(--color-text-3)]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <p className="text-xs text-[var(--color-text-3)]">Glisser ou <span className="text-[var(--color-g-600)] font-semibold">parcourir</span></p>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-3)] mb-2.5">Programmation</p>
                <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden mb-3">
                  {["Maintenant", "Programmer", "Brouillon"].map((opt, i) => (
                    <button
                      key={opt}
                      className={`flex-1 py-2 text-[11px] font-semibold transition-all ${
                        i === 1
                          ? "bg-[var(--color-g-100)] text-[var(--color-g-600)]"
                          : "text-[var(--color-text-3)]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="date"
                    defaultValue="2025-05-11"
                    className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs outline-none focus:border-[var(--color-g-400)] transition-colors"
                  />
                  <input
                    type="time"
                    defaultValue="09:00"
                    className="w-24 px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs outline-none focus:border-[var(--color-g-400)] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--color-border)] flex gap-2 flex-shrink-0">
              <button
                onClick={async () => {
                  setSaving(true);
                  await fetch("/api/social/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content_fr: "", platforms: selectedPlatforms, status: "draft" }),
                  });
                  setSaving(false);
                }}
                className="flex-1 py-2 border border-[var(--color-border)] rounded-lg text-xs font-semibold text-[var(--color-text-2)]"
              >
                {saving ? "..." : "Brouillon"}
              </button>
              <button
                onClick={async () => {
                  setSaving(true);
                  await fetch("/api/social/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content_fr: "", platforms: selectedPlatforms, status: "scheduled", scheduled_at: new Date().toISOString() }),
                  });
                  setSaving(false);
                  window.location.reload();
                }}
                className="flex-1 py-2 rounded-lg bg-[var(--color-g-600)] text-white text-xs font-semibold hover:bg-[var(--color-g-700)] transition-colors"
              >
                Programmer →
              </button>
            </div>

            {/* Queue */}
            <div className="border-t border-[var(--color-border)] flex-shrink-0">
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="font-[var(--font-display)] text-xs font-bold text-[var(--color-text)]">Publications programmées</span>
                <span className="text-[11px] text-[var(--color-text-3)]">7 ce mois</span>
              </div>
              <div className="max-h-[180px] overflow-y-auto divide-y divide-[var(--color-border)]">
                {MAY_POSTS.filter(p => p.status !== "published").slice(0, 4).map((post, i) => (
                  <div key={i} className="flex items-start gap-2.5 px-5 py-2.5">
                    <div className="flex gap-0.5 mt-0.5 flex-shrink-0">
                      {post.platforms.slice(0, 2).map((p) => (
                        <span key={p} className={`w-2 h-2 rounded-full ${PLATFORM_COLORS[p].dot}`} />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[var(--color-text)] truncate mb-0.5">{post.title}</p>
                      <p className="text-[10px] text-[var(--color-text-3)]">{post.day} mai · 09:00</p>
                    </div>
                    <span className={`flex-shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${STATUS_COLORS[post.status]}`}>
                      {post.status === "scheduled" ? "Programmé" : "Brouillon"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
