"use client";

import { useCallback, useEffect, useState } from "react";
import type { SocialPost } from "@/lib/db/types";

type Platform = "facebook" | "linkedin" | "tiktok" | "whatsapp";

interface Post {
  id: string;
  day: number;
  platforms: Platform[];
  title: string;
  content_fr: string | null;
  scheduled_at: string | null;
  status: "scheduled" | "draft" | "published";
}

const PLATFORM_COLORS: Record<Platform, { dot: string; tag: string; text: string }> = {
  facebook:  { dot: "bg-blue-600",    tag: "bg-blue-50 text-blue-600",     text: "Facebook" },
  linkedin:  { dot: "bg-blue-800",    tag: "bg-indigo-50 text-indigo-700", text: "LinkedIn" },
  tiktok:    { dot: "bg-red-500",     tag: "bg-red-50 text-red-600",       text: "TikTok" },
  whatsapp:  { dot: "bg-green-600",   tag: "bg-green-50 text-green-700",   text: "WhatsApp" },
};

const STATUS_COLORS = {
  scheduled: "bg-[var(--color-g-100)] text-[var(--color-g-600)]",
  draft:     "bg-[var(--color-a-100)] text-[var(--color-a-600)]",
  published: "bg-emerald-50 text-emerald-700",
};

function monthKeyOf(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function SocialCalendar() {
  const [month, setMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [composerOpen, setComposerOpen] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["facebook", "linkedin"]);
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10));
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [scheduleMode, setScheduleMode] = useState<"now" | "schedule" | "draft">("schedule");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const monthKey = monthKeyOf(month);

  const loadPosts = useCallback(() => {
    fetch(`/api/social/posts?month=${monthKey}`)
      .then((r) => r.json())
      .then((data: SocialPost[]) => {
        if (!Array.isArray(data)) {
          setPosts([]);
          return;
        }
        const mapped: Post[] = data
          .filter((p) => p.scheduled_at)
          .map((p) => ({
            id: p.id,
            day: new Date(p.scheduled_at!).getDate(),
            platforms: p.platforms as Platform[],
            title: (p.content_fr ?? p.content_en ?? "Publication").slice(0, 50),
            content_fr: p.content_fr,
            scheduled_at: p.scheduled_at,
            status: p.status as Post["status"],
          }));
        setPosts(mapped);
      })
      .catch(() => setPosts([]));
  }, [monthKey]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function togglePlatform(p: Platform) {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  function resetComposer() {
    setContent("");
    setSelectedPlatforms(["facebook", "linkedin"]);
    setScheduleMode("schedule");
    setEditingId(null);
  }

  function editPost(post: Post) {
    setEditingId(post.id);
    setContent(post.content_fr ?? "");
    setSelectedPlatforms(post.platforms);
    if (post.scheduled_at) {
      const d = new Date(post.scheduled_at);
      setScheduledDate(d.toISOString().slice(0, 10));
      setScheduledTime(d.toTimeString().slice(0, 5));
      setScheduleMode("schedule");
    } else {
      setScheduleMode("draft");
    }
    setComposerOpen(true);
  }

  async function savePost(asDraft: boolean) {
    setSaving(true);
    const status = asDraft || scheduleMode === "draft" ? "draft" : "scheduled";
    const scheduled_at =
      status === "draft"
        ? null
        : scheduleMode === "now"
        ? new Date().toISOString()
        : `${scheduledDate}T${scheduledTime}:00`;

    const payload = {
      content_fr: content,
      platforms: selectedPlatforms,
      status,
      scheduled_at,
    };

    const res = await fetch(
      editingId ? `/api/social/posts/${editingId}` : "/api/social/posts",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    setSaving(false);
    if (res.ok) {
      resetComposer();
      loadPosts();
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Supprimer cette publication ?")) return;
    const res = await fetch(`/api/social/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      if (editingId === id) resetComposer();
      loadPosts();
    }
  }

  const year = month.getFullYear();
  const m = month.getMonth();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const firstDow = (new Date(year, m, 1).getDay() + 6) % 7; // Mon = 0

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const now = new Date();
  const today = now.getFullYear() === year && now.getMonth() === m ? now.getDate() : -1;
  const monthLabel = month.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const scheduledThisMonth = posts.filter((p) => p.status !== "published");

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Topbar */}
      <div className="px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMonth(new Date(year, m - 1, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-3)] hover:border-[var(--color-g-400)] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span className="font-[var(--font-display)] text-sm font-semibold text-[var(--color-text)] min-w-[130px] text-center capitalize">
            {monthLabel}
          </span>
          <button
            onClick={() => setMonth(new Date(year, m + 1, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-3)] hover:border-[var(--color-g-400)] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <button
            onClick={() => setMonth(new Date(now.getFullYear(), now.getMonth(), 1))}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[var(--color-text-3)] border border-[var(--color-border)] hover:border-[var(--color-g-400)] transition-colors"
          >
            Aujourd&apos;hui
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => { resetComposer(); setComposerOpen(true); }}
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
                  className={`relative min-h-[88px] p-2.5 transition-colors group ${
                    isToday ? "bg-[var(--color-g-50)]" : "bg-white hover:bg-[oklch(99%_0.006_145)]"
                  }`}
                >
                  <span className={`block text-xs font-semibold mb-1.5 ${isToday ? "text-[var(--color-g-600)] font-bold" : "text-[var(--color-text-2)]"}`}>
                    {day}
                  </span>
                  <div className="space-y-0.5">
                    {dayPosts.slice(0, 2).map((post) => {
                      const multi = post.platforms.length > 1;
                      const firstPlat = post.platforms[0];
                      return (
                        <button
                          key={post.id}
                          onClick={() => editPost(post)}
                          className={`block w-full text-left rounded px-1.5 py-0.5 text-[10px] font-medium truncate ${
                            multi
                              ? "bg-[var(--color-g-100)] text-[var(--color-g-600)]"
                              : `${PLATFORM_COLORS[firstPlat].tag}`
                          }`}
                        >
                          {post.title}
                        </button>
                      );
                    })}
                    {dayPosts.length > 2 && (
                      <div className="text-[10px] text-[var(--color-text-3)] pl-1">+{dayPosts.length - 2} de plus</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Composer */}
        {composerOpen && (
          <div className="w-[340px] flex-shrink-0 bg-white border-l border-[var(--color-border)] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] flex-shrink-0">
              <span className="text-xs font-semibold text-[var(--color-g-600)]">
                {editingId ? "Modifier la publication" : "Composer"}
              </span>
              {editingId && (
                <button onClick={resetComposer} className="text-[11px] font-semibold text-[var(--color-text-3)] hover:text-[var(--color-text)]">
                  Annuler
                </button>
              )}
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
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-3)] mb-2.5">Contenu (FR)</p>
                <textarea
                  className="w-full px-3.5 py-3 border border-[var(--color-border)] rounded-lg text-xs leading-relaxed resize-none outline-none focus:border-[var(--color-g-400)] transition-colors"
                  rows={7}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Rédigez votre publication..."
                />
                <p className="text-[10px] text-[var(--color-text-3)] text-right mt-1">{content.length} / 500</p>
              </div>

              {/* Schedule */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-3)] mb-2.5">Programmation</p>
                <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden mb-3">
                  {(["now", "schedule", "draft"] as const).map((mode, i) => {
                    const labels = ["Maintenant", "Programmer", "Brouillon"];
                    return (
                      <button
                        key={mode}
                        onClick={() => setScheduleMode(mode)}
                        className={`flex-1 py-2 text-[11px] font-semibold transition-all ${
                          scheduleMode === mode
                            ? "bg-[var(--color-g-100)] text-[var(--color-g-600)]"
                            : "text-[var(--color-text-3)]"
                        }`}
                      >
                        {labels[i]}
                      </button>
                    );
                  })}
                </div>
                {scheduleMode === "schedule" && (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs outline-none focus:border-[var(--color-g-400)] transition-colors"
                    />
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-24 px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs outline-none focus:border-[var(--color-g-400)] transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--color-border)] flex gap-2 flex-shrink-0">
              <button
                onClick={() => savePost(true)}
                disabled={saving || !content.trim()}
                className="flex-1 py-2 border border-[var(--color-border)] rounded-lg text-xs font-semibold text-[var(--color-text-2)] disabled:opacity-50"
              >
                {saving ? "..." : "Brouillon"}
              </button>
              <button
                onClick={() => savePost(false)}
                disabled={saving || !content.trim()}
                className="flex-1 py-2 rounded-lg bg-[var(--color-g-600)] text-white text-xs font-semibold hover:bg-[var(--color-g-700)] transition-colors disabled:opacity-50"
              >
                {editingId ? "Enregistrer" : "Programmer →"}
              </button>
            </div>

            {/* Queue */}
            <div className="border-t border-[var(--color-border)] flex-shrink-0">
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="font-[var(--font-display)] text-xs font-bold text-[var(--color-text)]">Publications programmées</span>
                <span className="text-[11px] text-[var(--color-text-3)]">{scheduledThisMonth.length} ce mois</span>
              </div>
              <div className="max-h-[180px] overflow-y-auto divide-y divide-[var(--color-border)]">
                {scheduledThisMonth.length === 0 ? (
                  <p className="px-5 py-4 text-[11px] text-[var(--color-text-3)]">Aucune publication programmée ce mois-ci.</p>
                ) : (
                  scheduledThisMonth.map((post) => (
                    <div key={post.id} className="flex items-start gap-2.5 px-5 py-2.5 group">
                      <div className="flex gap-0.5 mt-0.5 flex-shrink-0">
                        {post.platforms.slice(0, 2).map((p) => (
                          <span key={p} className={`w-2 h-2 rounded-full ${PLATFORM_COLORS[p].dot}`} />
                        ))}
                      </div>
                      <button onClick={() => editPost(post)} className="flex-1 min-w-0 text-left">
                        <p className="text-[11px] text-[var(--color-text)] truncate mb-0.5">{post.title}</p>
                        <p className="text-[10px] text-[var(--color-text-3)]">
                          {post.scheduled_at
                            ? new Date(post.scheduled_at).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
                            : "Brouillon"}
                        </p>
                      </button>
                      <span className={`flex-shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${STATUS_COLORS[post.status]}`}>
                        {post.status === "scheduled" ? "Programmé" : "Brouillon"}
                      </span>
                      <button
                        onClick={() => deletePost(post.id)}
                        aria-label="Supprimer"
                        className="flex-shrink-0 text-[var(--color-text-3)] hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
