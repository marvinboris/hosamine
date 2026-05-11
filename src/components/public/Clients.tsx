import { useTranslations } from "next-intl";
import Image from "next/image";

const CLIENTS = [
  { name: "NHPC",            file: "nhpc.png" },
  { name: "Schlumberger",    file: "schlumberger.png" },
  { name: "DHL",             file: "dhl.png" },
  { name: "UBA",             file: "uba.png" },
  { name: "SAICAM",          file: "saicam.png" },
  { name: "NOVIA Industries",file: "novia.png" },
  { name: "CBCH",            file: "cbch.png" },
  { name: "Security Boat",   file: "sbs.png" },
  { name: "CCIMA",           file: "ccima.png" },
  { name: "Padre Pio",       file: "padre-pio.png" },
];

export default function Clients() {
  const t = useTranslations("clients");

  return (
    <section id="clients" className="py-20 md:py-24 bg-white">
      <div className="si">
        <div className="mb-12">
          <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-g-500)] mb-3">
            {t("label")}
          </span>
          <h2 className="font-[var(--font-display)] text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-snug tracking-tight">
            {t("title")}
          </h2>
        </div>

        {/* 2 cols mobile, 4 cols md, 5 cols lg */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-xl overflow-hidden">
          {CLIENTS.map(({ name, file }) => (
            <div
              key={name}
              className="group bg-white p-6 flex items-center justify-center min-h-[80px] transition-colors hover:bg-[var(--color-g-50)]"
            >
              <Image
                src={`/images/clients/${file}`}
                alt={name}
                width={96}
                height={36}
                className="h-9 w-full object-contain [mix-blend-mode:multiply] opacity-55 grayscale transition-all duration-200 group-hover:grayscale-0 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
