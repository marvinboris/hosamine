import { useTranslations } from "next-intl";

const CERTS = [
  { key: "c1", badge: "MIN" },
  { key: "c2", badge: "MNS" },
  { key: "c3", badge: "PAD" },
] as const;

const TAGS = ["ISO ISPM-15", "17 experts", "Douala", "Bilingue FR/EN"];

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-20 md:py-24 bg-[var(--color-g-50)]">
      <div className="si">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: text */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-g-500)] mb-3">
              {t("label")}
            </span>
            <h2 className="font-[var(--font-display)] text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-snug tracking-tight mb-5 whitespace-pre-line">
              {t("title")}
            </h2>
            <p className="text-[var(--color-text-2)] leading-[1.72] mb-7 text-sm md:text-base">
              {t("body")}
            </p>
            <div className="space-y-4">
              {(["m1", "m2"] as const).map((k) => (
                <div key={k} className="flex items-start gap-3">
                  <span className="mt-2 w-2 h-2 rounded-full bg-[var(--color-a-400)] flex-shrink-0" />
                  <span className="text-sm text-[var(--color-text-2)]">
                    <strong className="text-[var(--color-text)]">{t(`${k}_title` as any)} :</strong>{" "}
                    {t(`${k}_body` as any)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: certifications card */}
          <div className="relative bg-[var(--color-g-800)] rounded-xl p-8 md:p-11 overflow-hidden">
            {/* Diagonal pattern */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-45deg, transparent, transparent 28px, oklch(100% 0 0 / 0.025) 28px, oklch(100% 0 0 / 0.025) 29px)",
              }}
            />
            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/50 mb-5">
                {t("certs_title")}
              </p>
              <div className="space-y-0 divide-y divide-white/10">
                {CERTS.map(({ key, badge }) => (
                  <div key={key} className="flex items-start gap-4 py-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-a-500)] flex items-center justify-center font-[var(--font-display)] font-extrabold text-xs text-[oklch(18%_0.08_60)] flex-shrink-0">
                      {badge}
                    </div>
                    <div>
                      <div className="font-[var(--font-display)] text-sm font-semibold text-white mb-0.5">
                        {t(`${key}_name` as any)}
                      </div>
                      <div className="text-xs text-white/68">{t(`${key}_desc` as any)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-white/7 text-xs font-medium text-white/65"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
