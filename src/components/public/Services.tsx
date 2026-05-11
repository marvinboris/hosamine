import { useTranslations } from "next-intl";
import Link from "next/link";

interface ServiceProps {
  num: string;
  title: string;
  desc: string;
  items: string[];
  learnMore: string;
  variant: "primary" | "light" | "white" | "amber";
  className?: string;
}

function ServiceCard({ num, title, desc, items, learnMore, variant, className = "" }: ServiceProps) {
  const variants = {
    primary: {
      bg: "bg-[var(--color-g-800)]",
      num: "text-white/28",
      title: "text-white",
      desc: "text-white/62",
      item: "text-white/78",
      dot: "bg-[var(--color-a-400)]",
      link: "text-[var(--color-a-400)]",
    },
    light: {
      bg: "bg-[var(--color-g-100)]",
      num: "text-[var(--color-g-500)]",
      title: "text-[var(--color-g-700)]",
      desc: "text-[var(--color-text-2)]",
      item: "text-[var(--color-text)]",
      dot: "bg-[var(--color-g-500)]",
      link: "text-[var(--color-g-600)]",
    },
    white: {
      bg: "bg-white",
      num: "text-[var(--color-text-3)]",
      title: "text-[var(--color-text)]",
      desc: "text-[var(--color-text-2)]",
      item: "text-[var(--color-text-2)]",
      dot: "bg-[var(--color-text-3)]",
      link: "text-[var(--color-g-600)]",
    },
    amber: {
      bg: "bg-[var(--color-a-100)]",
      num: "text-[var(--color-a-600)]",
      title: "text-[oklch(28%_0.08_60)]",
      desc: "text-[oklch(38%_0.06_60)]",
      item: "text-[oklch(35%_0.07_60)]",
      dot: "bg-[var(--color-a-600)]",
      link: "text-[var(--color-a-600)]",
    },
  };
  const s = variants[variant];

  return (
    <div className={`${s.bg} p-8 md:p-11 lg:p-12 ${className}`}>
      <div className={`text-xs font-bold tracking-[0.1em] mb-4 font-[var(--font-display)] ${s.num}`}>
        {num}
      </div>
      <h3 className={`font-[var(--font-display)] text-xl md:text-2xl font-bold leading-snug tracking-tight mb-3.5 ${s.title}`}>
        {title}
      </h3>
      <p className={`text-sm leading-[1.72] mb-5 ${s.desc}`}>{desc}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className={`text-sm flex items-start gap-2 ${s.item}`}>
            <span className={`mt-2 w-1 h-1 rounded-full flex-shrink-0 ${s.dot}`} />
            {item}
          </li>
        ))}
      </ul>
      <Link
        href="#contact"
        className={`inline-flex items-center gap-1.5 mt-7 text-sm font-semibold after:content-['→'] transition-opacity hover:opacity-75 ${s.link}`}
      >
        {learnMore}
      </Link>
    </div>
  );
}

export default function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="py-20 md:py-24 bg-white">
      <div className="si mb-12 md:mb-14">
        <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-g-500)] mb-3">
          {t("label")}
        </span>
        <h2 className="font-[var(--font-display)] text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-snug tracking-tight">
          {t("title")}
        </h2>
      </div>

      {/* Mobile: stacked. Desktop: asymmetric 2-col grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-px bg-[var(--color-border)]">
        {/* Service 1: primary — full height left on desktop */}
        <ServiceCard
          num="01"
          title={t("s1_title")}
          desc={t("s1_desc")}
          items={[t("s1_i1"), t("s1_i2"), t("s1_i3"), t("s1_i4"), t("s1_i5")]}
          learnMore={t("learn_more")}
          variant="primary"
          className="lg:row-span-2"
        />

        {/* Right column stacked */}
        <ServiceCard
          num="02"
          title={t("s2_title")}
          desc={t("s2_desc")}
          items={[t("s2_i1"), t("s2_i2"), t("s2_i3")]}
          learnMore={t("learn_more")}
          variant="light"
        />
        <ServiceCard
          num="03"
          title={t("s3_title")}
          desc={t("s3_desc")}
          items={[t("s3_i1"), t("s3_i2"), t("s3_i3")]}
          learnMore={t("learn_more")}
          variant="white"
        />
        <ServiceCard
          num="04"
          title={t("s4_title")}
          desc={t("s4_desc")}
          items={[t("s4_i1"), t("s4_i2"), t("s4_i3")]}
          learnMore={t("learn_more")}
          variant="amber"
        />
      </div>
    </section>
  );
}
