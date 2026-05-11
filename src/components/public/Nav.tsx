"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const locale = pathname.startsWith("/en") ? "en" : "fr";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on scroll
  useEffect(() => {
    if (scrolled) setMenuOpen(false);
  }, [scrolled]);

  function switchLocale(next: "fr" | "en") {
    const withoutLocale = pathname.replace(/^\/(en|fr)/, "") || "/";
    router.push(next === "fr" ? withoutLocale : `/en${withoutLocale}`);
  }

  const navBase =
    "fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center px-5 md:px-8 lg:px-12 transition-all duration-300";
  const navBg = scrolled
    ? "bg-[oklch(99%_0.004_145/0.97)] backdrop-blur-md shadow-[0_1px_0_var(--color-border)]"
    : "";

  const linkColor = scrolled
    ? "text-[var(--color-text-2)] hover:text-[var(--color-g-600)]"
    : "text-white/80 hover:text-white";

  const logoFilter = scrolled ? "" : "brightness-0 invert";

  return (
    <>
      <nav className={`${navBase} ${navBg}`}>
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="Hosamine SARL"
            width={140}
            height={46}
            priority
            className={`h-9 w-auto transition-all duration-300 [clip-path:inset(0_0_0_5px)] ${logoFilter}`}
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-8 list-none mx-auto">
          {(["services", "about", "clients", "contact"] as const).map((k) => (
            <li key={k}>
              <a href={`#${k}`} className={`text-sm font-medium transition-colors ${linkColor}`}>
                {t(k)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3 ml-auto md:ml-0">
          {/* Lang toggle */}
          <div className={`flex rounded-full overflow-hidden border transition-colors ${
            scrolled ? "border-[var(--color-border)]" : "border-white/20"
          }`}>
            {(["fr", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={`px-3 py-1 text-[11px] font-bold tracking-widest uppercase transition-all ${
                  locale === l
                    ? scrolled
                      ? "bg-[var(--color-g-600)] text-white"
                      : "bg-white/15 text-white"
                    : scrolled
                    ? "text-[var(--color-text-3)]"
                    : "text-white/50"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* CTA — desktop only */}
          <Link
            href="#contact"
            className="hidden md:inline-flex items-center px-5 py-2 rounded-[5px] bg-[var(--color-a-500)] text-[oklch(18%_0.08_60)] text-sm font-semibold font-[var(--font-display)] transition-all hover:bg-[var(--color-a-600)] hover:-translate-y-px"
          >
            {t("cta")}
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col gap-1.5 w-8 items-end"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className={`block h-0.5 rounded transition-all ${menuOpen ? "w-6 rotate-45 translate-y-2" : "w-6"} ${scrolled ? "bg-[var(--color-text)]" : "bg-white"}`} />
            <span className={`block h-0.5 rounded transition-all ${menuOpen ? "opacity-0 w-6" : "w-4"} ${scrolled ? "bg-[var(--color-text)]" : "bg-white"}`} />
            <span className={`block h-0.5 rounded transition-all ${menuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-6"} ${scrolled ? "bg-[var(--color-text)]" : "bg-white"}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--color-g-900)] flex flex-col pt-[68px]">
          <ul className="flex flex-col list-none px-6 pt-8 gap-2">
            {(["services", "about", "clients", "contact"] as const).map((k) => (
              <li key={k}>
                <a
                  href={`#${k}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-4 text-xl font-semibold text-white/80 border-b border-white/8 hover:text-white transition-colors font-[var(--font-display)]"
                >
                  {t(k)}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-6 pt-8">
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center py-4 rounded-[5px] bg-[var(--color-a-500)] text-[oklch(18%_0.08_60)] font-semibold font-[var(--font-display)]"
            >
              {t("cta")}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
