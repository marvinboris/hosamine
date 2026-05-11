import { useTranslations } from "next-intl";

export default function CTA() {
  const t = useTranslations("cta");

  return (
    <section id="contact" className="py-24 md:py-28 bg-[var(--color-g-800)] relative overflow-hidden">
      {/* Diagonal pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 34px, oklch(100% 0 0 / 0.015) 34px, oklch(100% 0 0 / 0.015) 35px)",
        }}
      />
      <div className="relative si text-center max-w-[640px]">
        <h2 className="font-[var(--font-display)] text-[clamp(1.8rem,3.5vw,2.7rem)] font-bold text-white leading-snug tracking-tight mb-5 whitespace-pre-line">
          {t("title")}
        </h2>
        <p className="text-white/58 leading-[1.68] mb-10 text-sm md:text-base">
          {t("sub")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a
            href={`tel:${t("btn_phone").replace(/\s/g, "")}`}
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-[5px] bg-[var(--color-a-500)] text-[oklch(18%_0.08_60)] font-semibold font-[var(--font-display)] text-sm transition-all hover:bg-[var(--color-a-600)] hover:-translate-y-0.5"
          >
            {t("btn_phone")}
          </a>
          <a
            href={`mailto:${t("btn_email")}`}
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-[5px] border border-white/45 text-white font-[var(--font-display)] font-medium text-sm transition-all hover:border-white/70 hover:bg-white/8"
          >
            {t("btn_email")}
          </a>
        </div>
      </div>
    </section>
  );
}
