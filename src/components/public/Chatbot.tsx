"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Chatbot() {
  const t = useTranslations("chatbot");
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat"
        className="fixed bottom-6 right-5 md:bottom-7 md:right-7 z-50 w-14 h-14 rounded-full bg-[var(--color-g-600)] shadow-[0_4px_22px_oklch(20%_0.10_145/0.45)] flex items-center justify-center transition-all hover:scale-105 hover:bg-[var(--color-g-700)] active:scale-95"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-5 md:right-7 z-50 w-[calc(100vw-2.5rem)] max-w-[340px] bg-white rounded-2xl shadow-[0_12px_44px_oklch(20%_0.10_145/0.18),0_0_0_1px_var(--color-border)] overflow-hidden flex flex-col animate-[slideUp_0.25s_ease-out]">
          {/* Header */}
          <div className="bg-[var(--color-g-700)] px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-[var(--font-display)] font-extrabold text-sm text-[var(--color-g-700)] flex-shrink-0">
              H
            </div>
            <div>
              <div className="font-[var(--font-display)] text-sm font-semibold text-white">{t("name")}</div>
              <div className="text-[11px] text-white/55 mt-0.5">{t("status")}</div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/55 hover:text-white text-xl leading-none px-1">
              ×
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            <div className="bg-[var(--color-g-50)] rounded-[0_10px_10px_10px] px-4 py-3 text-sm leading-[1.58] text-[var(--color-text)] mb-4 max-w-[88%]">
              {t("greeting")}
            </div>
            <div className="flex flex-wrap gap-2">
              {(["qr1", "qr2", "qr3", "qr4"] as const).map((k) => (
                <button
                  key={k}
                  className="px-3.5 py-1.5 border border-[var(--color-g-200)] rounded-full text-xs font-medium text-[var(--color-g-600)] bg-white transition-all hover:bg-[var(--color-g-600)] hover:text-white hover:border-[var(--color-g-600)]"
                >
                  {t(k)}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-[var(--color-border)] flex gap-2">
            <input
              type="text"
              placeholder={t("placeholder")}
              className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-full text-sm outline-none focus:border-[var(--color-g-400)] font-[var(--font-body)]"
            />
            <button className="w-9 h-9 rounded-full bg-[var(--color-g-600)] flex items-center justify-center text-white flex-shrink-0 hover:bg-[var(--color-g-700)] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
