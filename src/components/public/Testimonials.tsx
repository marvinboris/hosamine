import { useTranslations } from "next-intl";

const TESTIMONIALS = [
  { textKey: "t1_text", nameKey: "t1_name", roleKey: null, companyKey: "t1_company" },
  { textKey: "t2_text", nameKey: "t2_name", roleKey: "t2_role", companyKey: "t2_company" },
  { textKey: "t3_text", nameKey: "t3_name", roleKey: "t3_role", companyKey: "t3_company" },
] as const;

export default function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section className="py-20 md:py-24 bg-[var(--color-g-50)]">
      <div className="si">
        <div className="mb-12 md:mb-14">
          <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-g-500)] mb-3">
            {t("label")}
          </span>
          <h2 className="font-[var(--font-display)] text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-snug tracking-tight">
            {t("title")}
          </h2>
        </div>

        {/* Stack on mobile, 3-col on lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {TESTIMONIALS.map(({ textKey, nameKey, roleKey, companyKey }, i) => (
            <div key={i} className="flex flex-col">
              {/* Large quotation mark */}
              <span
                className="font-serif text-[5.5rem] leading-[0.75] tracking-[-0.04em] text-[var(--color-a-400)] mb-3 select-none"
                aria-hidden
              >
                &ldquo;
              </span>
              <p className="text-sm md:text-base leading-[1.78] text-[var(--color-text)] italic mb-6 flex-1">
                {t(textKey)}
              </p>
              <div className="border-t border-[var(--color-border)] pt-4">
                <div className="font-[var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
                  {t(nameKey)}
                </div>
                <div className="text-xs text-[var(--color-text-3)] mt-0.5">
                  {roleKey ? `${t(roleKey)} — ` : ""}
                  {t(companyKey)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
