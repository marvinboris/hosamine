import { useTranslations } from "next-intl";

const PARTNERS = [
  "Solevo", "ARYSTA", "Danken Agrosolutions",
  "Royal Chimie", "Horizon Phyto Plus", "AGROCHEM",
  "Eagrow", "Fimex International",
];

export default function Partners() {
  const t = useTranslations("partners");

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="si">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-3)] mb-8">
          {t("label")}
        </p>
        {/* Wrap on mobile, single row on lg */}
        <div className="flex flex-wrap justify-center">
          {PARTNERS.map((p, i) => (
            <span
              key={p}
              className={`px-5 py-2 text-xs font-bold tracking-[0.04em] text-[var(--color-text-3)] hover:text-[var(--color-g-600)] transition-colors cursor-default ${
                i < PARTNERS.length - 1 ? "border-r border-[var(--color-border)]" : ""
              }`}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
