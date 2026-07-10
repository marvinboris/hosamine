import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative bg-white pt-[calc(76px+3rem)] pb-16 md:pb-20 lg:pt-[calc(76px+4rem)] overflow-hidden">
      <div className="si grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
        {/* Left: copy */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border-2 border-[var(--color-ink)] rounded-full mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] flex-shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--color-text-2)]">
              {t("badge")}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-[var(--font-display)] font-black leading-[0.98] tracking-[-0.03em] text-[var(--color-ink)] mb-6 text-[clamp(2.6rem,6.5vw,4.6rem)]">
            {t("headline_1")}{" "}
            {t("headline_2")}
            <br />
            <span className="text-[var(--color-brand)]">{t("headline_accent")}</span>{" "}
            {t("headline_3")}
          </h1>

          {/* Sub */}
          <p className="text-[var(--color-text-2)] max-w-[500px] leading-[1.65] mb-9 text-base md:text-lg">
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

          {/* Credentials */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mt-9">
            {(["cred_1", "cred_2", "cred_4"] as const).map((k) => (
              <span
                key={k}
                className="inline-flex items-center px-3 py-1.5 rounded-md bg-[var(--color-g-100)] text-[11px] font-bold uppercase tracking-wide text-[var(--color-g-700)]"
              >
                {t(k)}
              </span>
            ))}
          </div>
        </div>

        {/* Right: framed field photo */}
        <div className="relative">
          <div className="relative rounded-2xl border-4 border-[var(--color-ink)] shadow-brutal-static overflow-hidden aspect-[4/5] max-w-[440px] mx-auto lg:mx-0 lg:ml-auto">
            <Image
              src="/images/hero.jpg"
              alt="Technicien Hosamine en intervention"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 440px"
              className="object-cover"
            />
          </div>
          {/* Accent floating badge */}
          <div className="hidden sm:block absolute -bottom-4 -left-4 lg:left-2 bg-[var(--color-brand)] border-4 border-[var(--color-ink)] rounded-xl px-4 py-3 shadow-brutal-static">
            <p className="font-[var(--font-display)] font-black text-white text-2xl leading-none">5+</p>
            <p className="text-white/90 text-[10px] font-bold uppercase tracking-wide mt-1">{t("cred_1")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
