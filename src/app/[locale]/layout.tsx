import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { mergeContentOverrides } from "@/lib/content";
import "../globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hosamine SARL — Expert en Solutions Environnementales et Agricoles",
  description:
    "Hygiène publique, traitements phytosanitaires et assainissement pour les entreprises et institutions du Cameroun. Agréé MINADER, MINSANTE, Port Autonome de Douala.",
  openGraph: {
    title: "Hosamine SARL",
    description: "Expert en Solutions Environnementales et Agricoles",
    url: "https://hosamine.net",
    siteName: "Hosamine SARL",
    locale: "fr_FR",
    type: "website",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const mergedMessages = await mergeContentOverrides(
    messages as Record<string, Record<string, unknown>>,
    locale
  );

  return (
    <html lang={locale} className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider messages={mergedMessages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
