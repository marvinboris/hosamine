"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const locale = pathname.startsWith("/en") ? "en" : "fr";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (scrolled) setMenuOpen(false);
  }, [scrolled]);

  function switchLocale(next: "fr" | "en") {
    const withoutLocale = pathname.replace(/^\/(en|fr)/, "") || "";
    window.location.href = `/${next}${withoutLocale}`;
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center px-5 md:px-8 lg:px-12 bg-white border-b-2 border-[var(--color-ink)] transition-shadow duration-300 ${
          scrolled ? "shadow-[0_4px_0_-1px_var(--color-g-100)]" : ""
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="Hosamine SARL"
            width={140}
            height={46}
            priority
            className="h-9 w-auto [clip-path:inset(0_0_0_5px)]"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-8 list-none mx-auto">
          {(["services", "about", "clients", "contact"] as const).map((k) => (
            <li key={k}>
              <a
                href={`#${k}`}
                className="text-sm font-semibold text-[var(--color-text-2)] hover:text-[var(--color-brand)] transition-colors"
              >
                {t(k)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3 ml-auto md:ml-0">
          {/* Lang toggle */}
          <div className="flex rounded-lg overflow-hidden border-2 border-[var(--color-ink)]">
            {(["fr", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={`px-2.5 py-1 text-[11px] font-bold tracking-widest uppercase transition-all ${
                  locale === l
                    ? "bg-[var(--color-ink)] text-white"
                    : "bg-white text-[var(--color-text-3)] hover:text-[var(--color-ink)]"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* CTA — desktop only (clean, no offset) */}
          <Link
            href="#contact"
            className="hidden md:inline-flex items-center h-10 px-5 rounded-lg border-2 border-[var(--color-ink)] bg-[var(--color-brand)] text-white text-xs font-black uppercase tracking-wide font-[var(--font-display)] transition-colors hover:bg-[var(--color-brand-dark)]"
          >
            {t("cta")}
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col gap-1.5 w-8 items-end"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className={`block h-0.5 rounded bg-[var(--color-ink)] transition-all ${menuOpen ? "w-6 rotate-45 translate-y-2" : "w-6"}`} />
            <span className={`block h-0.5 rounded bg-[var(--color-ink)] transition-all ${menuOpen ? "opacity-0 w-6" : "w-4"}`} />
            <span className={`block h-0.5 rounded bg-[var(--color-ink)] transition-all ${menuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-6"}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown (under nav) */}
      {menuOpen && (
        <div className="fixed top-[68px] left-0 right-0 z-40 bg-white border-b-2 border-[var(--color-ink)] md:hidden">
          <ul className="flex flex-col list-none px-5 py-3">
            {(["services", "about", "clients", "contact"] as const).map((k) => (
              <li key={k}>
                <a
                  href={`#${k}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 text-sm font-semibold text-[var(--color-text-2)] hover:text-[var(--color-brand)] transition-colors"
                >
                  {t(k)}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-5 pb-4">
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center py-3 rounded-lg border-4 border-[var(--color-ink)] bg-[var(--color-brand)] text-white font-black uppercase tracking-wide font-[var(--font-display)] shadow-brutal-static"
            >
              {t("cta")}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
