import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-svh flex flex-col justify-center bg-[var(--color-g-900)] overflow-hidden">
      {/* Diagonal pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 34px, oklch(100% 0 0 / 0.018) 34px, oklch(100% 0 0 / 0.018) 35px)",
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[var(--color-g-50)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 si pt-[calc(68px+2.5rem)] pb-28 md:pb-36">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/18 rounded-full mb-7 md:mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-a-400)] flex-shrink-0" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-white/60">
            {t("badge")}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-[var(--font-display)] font-black leading-[1.04] tracking-[-0.035em] text-white mb-6 text-[clamp(2.8rem,8vw,5.2rem)]">
          {t("headline_1")}
          <br />
          {t("headline_2")}
          <br />
          <em className="not-italic text-[var(--color-a-400)]">{t("headline_accent")}</em>
          <br />
          {t("headline_3")}
        </h1>

        {/* Sub */}
        <p className="text-white/58 max-w-[480px] leading-[1.68] mb-10 text-sm md:text-base">
          {t("sub")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#services"
            className="inline-flex items-center justify-center h-14 px-8 rounded-lg border-4 border-[var(--color-ink)] bg-[var(--color-brand)] text-white font-black uppercase tracking-wide font-[var(--font-display)] text-sm shadow-brutal"
          >
            {t("cta_primary")}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center h-14 px-8 rounded-lg border-4 border-[var(--color-ink)] bg-white text-[var(--color-ink)] font-black uppercase tracking-wide font-[var(--font-display)] text-sm shadow-brutal"
          >
            {t("cta_secondary")}
          </a>
        </div>
      </div>

      {/* Credentials strip */}
      <div className="absolute bottom-10 left-0 right-0 z-10 si">
        <div className="flex flex-wrap items-center gap-x-0 gap-y-1 text-[11px] font-medium text-white/38">
          <span>{t("cred_1")}</span>
          <span className="mx-3 text-white/18">·</span>
          <span>{t("cred_2")}</span>
          <span className="mx-3 text-white/18">·</span>
          <span className="hidden sm:inline">{t("cred_3")}</span>
          <span className="hidden sm:inline mx-3 text-white/18">·</span>
          <span>{t("cred_4")}</span>
        </div>
      </div>
    </section>
  );
}
