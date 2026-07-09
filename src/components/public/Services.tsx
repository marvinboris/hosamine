import { useTranslations } from "next-intl";
import Link from "next/link";

interface ServiceProps {
  num: string;
  title: string;
  desc: string;
  items: string[];
  learnMore: string;
}

function ServiceCard({ num, title, desc, items, learnMore }: ServiceProps) {
  return (
    <div className="bg-white rounded-2xl border-4 border-[var(--color-ink)] shadow-brutal-static p-7 md:p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-brand)] text-white font-[var(--font-display)] font-black text-sm">
          {num}
        </span>
        <h3 className="font-[var(--font-display)] text-xl md:text-2xl font-black leading-tight tracking-[-0.01em] text-[var(--color-ink)]">
          {title}
        </h3>
      </div>
      <p className="text-sm leading-[1.7] text-[var(--color-text-2)] mb-5">{desc}</p>
      <ul className="space-y-2 mb-6 flex-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm flex items-start gap-2.5 text-[var(--color-text)]">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
      <Link
        href="#contact"
        className="inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-wide text-[var(--color-brand)] hover:gap-2.5 transition-all after:content-['→']"
      >
        {learnMore}
      </Link>
    </div>
  );
}

export default function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="py-20 md:py-24 bg-[var(--color-g-50)] border-b-4 border-[var(--color-ink)]">
      <div className="si">
        <div className="mb-12 md:mb-14 max-w-3xl">
          <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-[var(--color-brand)] mb-3">
            {t("label")}
          </span>
          <h2 className="font-[var(--font-display)] text-[clamp(1.7rem,4vw,3rem)] font-black leading-[1.05] tracking-[-0.02em] text-[var(--color-ink)]">
            {t("title")}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-7">
          <ServiceCard
            num="01"
            title={t("s1_title")}
            desc={t("s1_desc")}
            items={[t("s1_i1"), t("s1_i2"), t("s1_i3"), t("s1_i4"), t("s1_i5")]}
            learnMore={t("learn_more")}
          />
          <ServiceCard
            num="02"
            title={t("s2_title")}
            desc={t("s2_desc")}
            items={[t("s2_i1"), t("s2_i2"), t("s2_i3")]}
            learnMore={t("learn_more")}
          />
          <ServiceCard
            num="03"
            title={t("s3_title")}
            desc={t("s3_desc")}
            items={[t("s3_i1"), t("s3_i2"), t("s3_i3")]}
            learnMore={t("learn_more")}
          />
          <ServiceCard
            num="04"
            title={t("s4_title")}
            desc={t("s4_desc")}
            items={[t("s4_i1"), t("s4_i2"), t("s4_i3")]}
            learnMore={t("learn_more")}
          />
        </div>
      </div>
    </section>
  );
}
