import { useTranslations } from "next-intl";

export default function Stats() {
  const t = useTranslations("stats");

  const stats = [
    { value: t("v1"), suffix: "", label: t("l1") },
    { value: t("v2"), suffix: "+", label: t("l2") },
    { value: t("v3"), suffix: "", label: t("l3") },
    { value: t("v4"), suffix: "", label: t("l4") },
  ];

  return (
    <section className="bg-[var(--color-g-600)] py-12 md:py-14">
      <div className="grid grid-cols-2 md:grid-cols-4 si">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`text-center py-4 md:py-0 ${
              i < stats.length - 1
                ? "border-b md:border-b-0 md:border-r border-white/18"
                : ""
            } ${i % 2 === 0 && i < stats.length - 1 ? "border-r md:border-r border-white/18" : ""}`}
          >
            <div className="font-[var(--font-display)] text-[2.8rem] md:text-[3.2rem] font-black text-white leading-none tracking-[-0.04em] mb-2">
              {s.value}
              {s.suffix && <sup className="text-2xl">{s.suffix}</sup>}
            </div>
            <div className="text-sm text-white/62 font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
