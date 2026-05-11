import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-[var(--color-g-900)] pt-16 pb-8 md:pt-20">
      {/* Main grid: stack on mobile, 2-col md, 4-col lg */}
      <div className="si grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
        {/* Brand col */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Image
            src="/images/logo.png"
            alt="Hosamine SARL"
            width={150}
            height={49}
            className="h-11 w-auto mb-5 brightness-0 invert opacity-85 [clip-path:inset(0_0_0_5px)]"
          />
          <p className="text-xs text-white/58 leading-[1.65] mb-6">{t("tagline")}</p>
          <address className="not-italic space-y-1.5">
            <p className="text-xs text-white/65">{t("address")}</p>
            <p className="text-xs">
              <a href="tel:+237677550011" className="text-white/65 hover:text-[var(--color-a-400)] transition-colors">
                +237 677 550 011
              </a>
            </p>
            <p className="text-xs">
              <a href="mailto:contact@hosamine.net" className="text-white/65 hover:text-[var(--color-a-400)] transition-colors">
                contact@hosamine.net
              </a>
            </p>
          </address>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/45 mb-4">
            {t("col_services")}
          </h4>
          <ul className="space-y-2.5">
            {["Hygiène Publique", "Phytosanitaire", "Assainissement", "Formations"].map((s) => (
              <li key={s}>
                <Link href="#services" className="text-sm text-white/68 hover:text-white transition-colors">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/45 mb-4">
            {t("col_company")}
          </h4>
          <ul className="space-y-2.5">
            {([["about", "#about"], ["clients", "#clients"], ["partners", "#"], ["blog", "#"]] as const).map(
              ([key, href]) => (
                <li key={key}>
                  <Link href={href} className="text-sm text-white/68 hover:text-white transition-colors">
                    {t(`lnk_${key}` as any)}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/45 mb-4">
            {t("col_follow")}
          </h4>
          <ul className="space-y-2.5">
            {["Facebook", "LinkedIn", "TikTok", "WhatsApp Business"].map((s) => (
              <li key={s}>
                <Link href="#" className="text-sm text-white/68 hover:text-[var(--color-a-400)] transition-colors">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="si border-t border-white/8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-[11px] text-white/45">{t("copyright")}</p>
        <div className="flex gap-4">
          {["Facebook", "LinkedIn", "TikTok"].map((s) => (
            <Link key={s} href="#" className="text-[11px] font-medium text-white/32 hover:text-[var(--color-a-400)] transition-colors">
              {s}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
